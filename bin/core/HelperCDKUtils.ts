import {ShellString} from "shelljs";
import {DeploymentOptions} from "../options/DeployOptions";
import {CDKUtilsJsonData} from "../data/CDKUtilsJsonData";

const shell = require('shelljs');
const properties = require('java-properties');
const path = require("path");

/**
 * Helper CDK Utils Interface
 */
export interface HelperCDKUtils {
}

/**
 * Helper Core Utility Functions for CDK
 * @author acloudcoder
 */
export class HelperCDKUtils {

    public checkCredentials(): void {
        console.log("Checking credentials first...");
        let checkCommand = "aws sts get-caller-identity";
        console.log("Command to run : " + checkCommand);
        const returnCode: ShellString = shell.exec(checkCommand, {
            silent: true
        });
        if (returnCode.code == 255) {
            throw Error("Cant find credentials to deploy..please check.." + returnCode.stderr)
        } else {
            console.log("Credentials found with role:  " + returnCode.stdout)
        }
    }

    /**
     * Method to bootstrap stack
     * @param cdkUtilsJsonData
     * @param deploymentOptions
     */
    public bootstrapStack(cdkUtilsJsonData: CDKUtilsJsonData, deploymentOptions: DeploymentOptions) {
        if (deploymentOptions.toolkitBucketName && deploymentOptions.toolkitStackName) {
            console.log("Boot-strapping stack with toolkit bucket name :   " + deploymentOptions.toolkitBucketName + " and stack: " + deploymentOptions.toolkitStackName);
            var bootstrapCommand = "cdk bootstrap".concat(" ")
                .concat("--trace=").concat(String(deploymentOptions.trace)).concat(" ")
                .concat("--verbose=").concat(String(deploymentOptions.verbose)).concat(" ")
                .concat("--app=").concat("\"").concat(cdkUtilsJsonData.cloudformationToUse).concat("\"").concat(" ")
                .concat(deploymentOptions.proxy ? "--proxy=" : "").concat(" ")
                .concat("--profile=").concat(String(deploymentOptions.profile)).concat(" ")
                .concat("--execute=").concat(String(deploymentOptions.executeChangeSet)).concat(" ")
                .concat("--ec2-cred=").concat(String(deploymentOptions.ec2Cred)).concat(" ")
                .concat("--bootstrap-bucket-name=").concat(String(deploymentOptions.toolkitBucketName)).concat(" ")
                .concat("--toolkit-stack-name=").concat(String(deploymentOptions.toolkitStackName)).concat(" ");

            console.log("Command to run : " + bootstrapCommand);
            const returnCode: ShellString = shell.exec(bootstrapCommand, {
                silent: deploymentOptions.silent
            });

            if (returnCode.code == 1) {
                throw Error("Error in boot-strapping stack : " + deploymentOptions.toolkitStackName + " error : " + returnCode.stderr)
            } else {
                console.log("Successfully boot-strapped with stack  : " + deploymentOptions.toolkitStackName)
            }
        } else {
            throw Error("Toolkit bucket name or stack name is empty..exiting");
        }
    }

    /**
     * Method to get application property from property file
     * @param key
     * @param propertyPath
     */
    public getApplicationProperty(key: string, propertyPath: string): string {
        let values = properties.of(path.resolve(__dirname, propertyPath));
        console.log("Total properties found:   " + values.getKeys().length);
        return values.get(key);
    }

    /**
     * Method to fetch context
     */
    public fetchContext(propertyPath: string): any {
        let values = properties.of(path.resolve(__dirname, propertyPath));
        console.log("Total properties found:   " + values.getKeys().length);
        let map: { [key: string]: string } = {};
        for (let key of values.getKeys()) {
            console.log("Adding property : " + key + " into context");
            map[key] = values.get(key);
        }
        return map;
    }


}

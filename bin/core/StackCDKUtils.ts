import {performance} from "perf_hooks";
import {DeploymentOptions} from "../options/DeployOptions";
import {ShellString} from "shelljs";
import {DestroyOptions} from "../options/DestroyOptions";
import {CDKUtilsJsonData} from "../data/CDKUtilsJsonData";
import {AbstractNamingStrategy} from "../strategy/AbstractNamingStrategy";

const shell = require('shelljs');

/**
 * Stack  Core Utility Functions for CDK
 * @author acloudcoder
 */
export class StackCDKUtils<X extends CDKUtilsJsonData> {

    public stackNamingStrategy: AbstractNamingStrategy<any, any, any>;

    /**
     * Constructor
     * @param stackNamingStrategy
     */
    constructor(stackNamingStrategy: AbstractNamingStrategy<any, any, any>) {
        this.stackNamingStrategy = stackNamingStrategy;
    }

    /**
     * Usually, the Context allows replacing a Strategy object at runtime.
     */
    public setStrategy(stackNamingStrategy: AbstractNamingStrategy<any, any, any>) {
        this.stackNamingStrategy = stackNamingStrategy;
    }


    /**
     * Method to deploy respective stacks as per configuration
     * @param cdkUtilsJsonData - Environment and Component data
     * @param deploymentOptions - Deployment options
     */
    public deployStack(cdkUtilsJsonData: X, deploymentOptions: DeploymentOptions): void {
        console.log("Checking if stacks to deploy is present");
        const stacksToDeploy: string[] = this.stackNamingStrategy.getStacksToDeploy(cdkUtilsJsonData);
        if (stacksToDeploy) {
            console.log("Found :stacksToDeploy " + stacksToDeploy);
            stacksToDeploy.forEach((stackName) => {
                const t0 = performance.now();
                const fullStackName = this.stackNamingStrategy.generateStackNameForDeploy(deploymentOptions, stackName);
                console.log("Deploying stack: " + fullStackName);

                //creating deploy command dynamically
                const deployCommand = "cdk deploy".concat(" ")
                    .concat("--trace=").concat(String(deploymentOptions.trace)).concat(" ")
                    .concat("--verbose=").concat(String(deploymentOptions.verbose)).concat(" ")
                    .concat("--app=").concat("\"").concat(cdkUtilsJsonData.cloudformationToUse).concat("\"").concat(" ")
                    .concat(deploymentOptions.proxy ? "--proxy=" : "").concat(" ")
                    .concat("--profile=").concat(String(deploymentOptions.profile)).concat(" ")
                    .concat("--execute=").concat(String(deploymentOptions.executeChangeSet)).concat(" ")
                    .concat("--ec2-cred=").concat(String(deploymentOptions.ec2Cred)).concat(" ")
                    .concat("--require-approval=").concat(String(deploymentOptions.requiresApproval)).concat(" ")
                    .concat("--toolkit-stack-name=").concat(String(deploymentOptions.toolkitStackName)).concat(" ")
                    .concat(fullStackName);

                console.log("Command to run : " + deployCommand);

                const returnCode: ShellString = shell.exec(deployCommand, {
                    //if silent is false , then logs will emit otherwise only error will split out logs
                    silent: deploymentOptions.silent
                });

                //checking if the return of the command is failure
                if (returnCode.code == 1) {
                    throw Error("Error in deploying stack : " + fullStackName + " error : " + returnCode.stderr)
                } else {
                    const t1 = performance.now();
                    console.log("Time to deploy : " + fullStackName + " took: " + (t1 - t0) + " milliseconds.");
                    console.log("Successfully deployed : " + fullStackName)
                }
            })
        } else {
            throw Error("No stacks found to deploy..throwing error..");
        }
    }

    /**
     * Method to destroy respective stacks as per configuration
     * @param cdkUtilsJsonData
     * @param destroyOptions
     */
    public destroyStack(cdkUtilsJsonData: X, destroyOptions: DestroyOptions) {
        console.log("Checking if stacks to destroy is present");
        const stacksToDestroy: string[] = this.stackNamingStrategy.getStacksToDestroy(cdkUtilsJsonData);
        if (!stacksToDestroy) {
            throw Error("No stacks found to destroy..please check configuration")
        }
        console.log("Found : " + stacksToDestroy);
        stacksToDestroy.forEach((stackName) => {
            console.log("Stack : " + stackName);
            console.log("Env : " + destroyOptions.env);
            console.log("Component : " + destroyOptions.component);
            let fullStackName = this.stackNamingStrategy.generateStackNameForDestroy(destroyOptions, stackName);

            console.log("Destroying stack: " + fullStackName);
            var destroyCommand = "cdk destroy".concat(" ")
                .concat("--trace=").concat(String(destroyOptions.trace)).concat(" ")
                .concat("--verbose=").concat(String(destroyOptions.verbose)).concat(" ")
                .concat("--app=").concat("\"").concat(cdkUtilsJsonData.cloudformationToUse).concat("\"").concat(" ")
                .concat(destroyOptions.proxy ? "--proxy=" : "").concat(" ")
                .concat("--profile=").concat(String(destroyOptions.profile)).concat(" ")
                .concat("--ec2-cred=").concat(String(destroyOptions.ec2Cred)).concat(" ")
                .concat("--force=").concat(String(destroyOptions.force)).concat(" ")
                .concat(fullStackName);

            console.log("Command to run : " + destroyCommand);
            const returnCode: ShellString = shell.exec(destroyCommand, {
                silent: destroyOptions.silent
            });

            if (returnCode.code == 1) {
                throw Error("Error in destroying stack : " + fullStackName + " error : " + returnCode.stderr)
            } else {
                console.log("Successfully destroyed : " + fullStackName)
            }
        })
    }
}
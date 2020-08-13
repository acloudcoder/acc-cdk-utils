import {DeploymentOptions} from "../options/DeployOptions";
import {performance} from "perf_hooks";
import {ShellString} from "shelljs";
import {DestroyOptions} from "../options/DestroyOptions";
import {DeploymentNameStrategy} from "../strategy/impl/DeploymentNameStrategy";
import {DeploymentAndComponentNameStrategy} from "../strategy/impl/DeploymentAndComponentNameStrategy";
import {EnvAndComponentNameStrategy} from "../strategy/impl/EnvAndComponentNameStrategy";
import {CDKUtilsJsonData} from "../data/CDKUtilsJsonData";
import {AbstractNamingStrategy} from "../strategy/AbstractStackNamingStrategy";

var shell = require('shelljs');

/**
 * Stack CDK Utils Interface
 */
export interface StackCDKUtils {
}

/**
 * Stack  Core Utility Functions for CDK
 * @author Akshay Malik
 */
export class StackCDKUtils {

    public stackNamingStrategy: AbstractNamingStrategy<any, any>;

    /**
     * Constructor
     * @param stackNamingStrategy
     */
    constructor(stackNamingStrategy: AbstractNamingStrategy<any, any>) {
        this.stackNamingStrategy = stackNamingStrategy;
    }

    /**
     * Usually, the Context allows replacing a Strategy object at runtime.
     */
    public setStrategy(stackNamingStrategy: AbstractNamingStrategy<any, any>) {
        this.stackNamingStrategy = stackNamingStrategy;
    }

    /**
     * Method to deploy respective stacks as per configuration
     * @param cdkUtilsJsonData - Environment and Component data
     * @param deploymentOptions - Deployment options
     */
    public deployStack(cdkUtilsJsonData: CDKUtilsJsonData, deploymentOptions: DeploymentOptions): void {
        console.log("Checking if stacks to deploy is present");
        const stacksToDeploy: string[] = [];
        if (this.stackNamingStrategy instanceof EnvAndComponentNameStrategy && cdkUtilsJsonData.stacksToDeploy) {
            cdkUtilsJsonData.stacksToDeploy.toString().split(",").forEach(function (stack: string) {
                stacksToDeploy.push(stack)
            });
        } else if (this.stackNamingStrategy instanceof DeploymentNameStrategy && cdkUtilsJsonData.stacksToDeploy_noEnvSpecific_noComponentSpecific) {
            cdkUtilsJsonData.stacksToDeploy_noEnvSpecific_noComponentSpecific.toString().split(",").forEach(function (stack: string) {
                stacksToDeploy.push(stack)
            });
        } else if (this.stackNamingStrategy instanceof DeploymentAndComponentNameStrategy && cdkUtilsJsonData.stacksToDeploy_noEnvSpecific) {
            cdkUtilsJsonData.stacksToDeploy_noEnvSpecific.toString().split(",").forEach(function (stack: string) {
                stacksToDeploy.push(stack)
            });
        }

        if (stacksToDeploy) {
            console.log("Found :stacksToDeploy " + stacksToDeploy);
            stacksToDeploy.forEach((stackName) => {
                const t0 = performance.now();
                const fullStackName = this.stackNamingStrategy.generateStackNameForDeploy(deploymentOptions, stackName);
                console.log("Deploying stack: " + fullStackName);

                //creating deploy command dynamically
                var deployCommand = "cdk deploy".concat(" ")
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
    public destroyStack(cdkUtilsJsonData: CDKUtilsJsonData, destroyOptions: DestroyOptions) {
        console.log("Checking if stacks to destroy is present");
        const stacksToDestroy: string[] = [];

        if (destroyOptions.destroyStack && cdkUtilsJsonData.stacksToDestroy) {
            cdkUtilsJsonData.stacksToDestroy.toString().split(",").forEach(function (stack: string) {
                stacksToDestroy.push(stack)
            });

        }

        if (destroyOptions.destroyDatabaseStack && cdkUtilsJsonData.stacksToDestroy_database) {
            cdkUtilsJsonData.stacksToDestroy_database.toString().split(",").forEach(function (stack: string) {
                stacksToDestroy.push(stack)
            });
        }

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
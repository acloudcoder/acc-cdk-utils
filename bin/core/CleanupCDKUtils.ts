import {DestroyOptions} from "../options/DestroyOptions";
import {ShellString} from "shelljs";
import {CDKUtilsJsonData} from "../data/CDKUtilsJsonData";
import {AbstractNamingStrategy} from "../strategy/AbstractStackNamingStrategy";

const emptyBucket = require('empty-aws-bucket');
const AWS = require('aws-sdk-proxy');
const shell = require('shelljs');

/**
 * Cleanup CDK Utils Interface
 */
export interface CleanupCDKUtils {
}

/**
 * Cleanup Core Utility Functions for CDK
 * @author Akshay Malik
 */
export class CleanupCDKUtils {

    public namingStrategy: AbstractNamingStrategy<any, any>;

    /**
     * Constructor
     * @param stackNamingStrategy
     */
    constructor(stackNamingStrategy: AbstractNamingStrategy<any, any>) {
        this.namingStrategy = stackNamingStrategy;
    }

    /**
     * Usually, the Context allows replacing a Strategy object at runtime.
     */
    public setStrategy(stackNamingStrategy: AbstractNamingStrategy<any, any>) {
        this.namingStrategy = stackNamingStrategy;
    }


    /**
     * Method to empty S3 Bucket
     * @param cdkUtilsJsonData
     * @param destroyOptions
     */
    public emptyS3Bucket(cdkUtilsJsonData: CDKUtilsJsonData, destroyOptions: DestroyOptions) {
        console.log("Checking if stacks to destroy is present");
        const bucketsToEmpty: string[] = [];
        if (cdkUtilsJsonData.s3toEmpty) {
            cdkUtilsJsonData.s3toEmpty.toString().split(",").forEach(function (stack: string) {
                bucketsToEmpty.push(stack)
            });
        }
        if (!bucketsToEmpty) {
            console.log("No buckets data to be deleted..");
        } else {
            console.log("Found : " + bucketsToEmpty);
            bucketsToEmpty.forEach((bucket) => {
                console.log("Bucket : " + bucket);
                console.log("Env : " + destroyOptions.env);
                console.log("Component : " + destroyOptions.component);
                let fullBucketName = this.namingStrategy.generateStackNameForBuckets(destroyOptions, bucket);
                console.log("Deleting bucket content: " + fullBucketName);
                const awsConfig = {
                    credentials: new AWS.SharedIniFileCredentials({profile: destroyOptions.profile}),
                };
                emptyBucket(fullBucketName, [awsConfig]);
            })
        }
    }

    /**
     * Method to change delete permission for Aurora
     * @param destroyOptions
     * @param tableName
     * @param enableDeleteProtection
     */
    public modifyDeletePermissionForAurora(destroyOptions: DestroyOptions, tableName: string, enableDeleteProtection: boolean) {
        console.log("Checking if db is present");
        console.log("Disabling delete protection for table : ");
        console.log("env:" + destroyOptions.env);
        console.log("component: " + destroyOptions.component);
        const fullTableName = this.namingStrategy.generateStackNameForAurora(destroyOptions, tableName);
        const deleteCommand = "aws rds modify-db-cluster --db-cluster-identifier=" + fullTableName + enableDeleteProtection ? " --deletion-protection" : "--no-deletion-protection";
        const returnCode: ShellString = shell.exec(deleteCommand, {
            silent: destroyOptions.silent
        });
        if (returnCode.code == 1) {
            console.log("Failed to modify db cluster to disable delete protection for table : " + fullTableName)
        } else {
            console.log("Successfully updated the db cluster")
        }
    }

}

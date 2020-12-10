import {DestroyOptions} from "../options/DestroyOptions";
import {ShellString} from "shelljs";
import {CDKUtilsJsonData} from "../data/CDKUtilsJsonData";
import {AbstractNamingStrategy} from "../strategy/AbstractNamingStrategy";

const emptyBucket = require('empty-aws-bucket');
const AWS = require('aws-sdk-proxy');
const shell = require('shelljs');

/**
 * Cleanup Core Utility Functions for CDK
 * @author acloudcoder
 */
export class CleanupCDKUtils<X extends CDKUtilsJsonData> {

    public namingStrategy: AbstractNamingStrategy<any, any, any>;

    /**
     * Constructor
     * @param stackNamingStrategy
     */
    constructor(stackNamingStrategy: AbstractNamingStrategy<any, any, any>) {
        this.namingStrategy = stackNamingStrategy;
    }

    /**
     * Usually, the Context allows replacing a Strategy object at runtime.
     */
    public setStrategy(stackNamingStrategy: AbstractNamingStrategy<any, any, any>) {
        this.namingStrategy = stackNamingStrategy;
    }

    /**
     * Method to empty S3 Bucket
     * @param cdkUtilsJsonData
     * @param destroyOptions
     */
    public emptyS3Bucket(cdkUtilsJsonData: X, destroyOptions: DestroyOptions) {
        console.log("Checking if stacks to destroy is present");
        const bucketsToEmpty: string[] = this.namingStrategy.getBucketsToEmpty(cdkUtilsJsonData);
        if (!bucketsToEmpty) {
            console.log("No buckets data to be deleted..");
        } else {
            console.log("Found : " + bucketsToEmpty);
            bucketsToEmpty.forEach((bucket) => {
                console.log("Bucket : " + bucket);
                console.log("Env : " + destroyOptions.env);
                console.log("Variant : " + destroyOptions.variant);
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
     * @param cdkUtilsJsonData
     * @param destroyOptions
     * @param enableDeleteProtection
     */
    public modifyDeletePermissionForAurora(cdkUtilsJsonData: X, destroyOptions: DestroyOptions, enableDeleteProtection: boolean) {
        console.log("Checking if db is present");
        console.log("Env:" + destroyOptions.env);
        console.log("Variant: " + destroyOptions.variant);
        const auroraDbToModifyDeleteProtection: string[] = this.namingStrategy.getAuroraDbToModifyDeleteProtection(cdkUtilsJsonData);
        if (!auroraDbToModifyDeleteProtection) {
            console.log("No buckets data to be deleted..");
        } else {
            console.log("Found : " + auroraDbToModifyDeleteProtection);
            auroraDbToModifyDeleteProtection.forEach((db) => {
                const fullTableName = this.namingStrategy.generateStackNameForAurora(destroyOptions, db);
                console.log("Disabling delete protection for table : " + fullTableName);
                const deleteCommand = "aws rds modify-db-cluster --db-cluster-identifier=".concat(fullTableName).concat(" ").concat(enableDeleteProtection ? " --deletion-protection" : "--no-deletion-protection");
                console.log("Modify cluster command to run: " + deleteCommand);
                const returnCode: ShellString = shell.exec(deleteCommand, {
                    silent: destroyOptions.silent
                });
                if (returnCode.code == 1) {
                    throw Error("Failed to modify db cluster to disable delete protection for table : " + fullTableName + returnCode.stderr);
                } else {
                    console.log("Successfully updated the db cluster for table :" + fullTableName);
                }
            });
        }
    }

}

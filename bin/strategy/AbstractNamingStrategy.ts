/**
 * Abstract Stack Naming Strategy
 * @author acloudcoder
 */
import {DeploymentOptions} from "../options/DeployOptions";
import {DestroyOptions} from "../options/DestroyOptions";
import {CDKUtilsJsonData} from "../data/CDKUtilsJsonData";

export interface AbstractNamingStrategy<K extends DeploymentOptions, V extends DestroyOptions, X extends CDKUtilsJsonData> {

    /**
     * Override this method to write custom source to identify stacks that need to be deployed
     * @param cdkUtilsJsonData
     */
    getStacksToDeploy(cdkUtilsJsonData: X): string[]

    /**
     * Override this method to write custom source to identify stacks that need to be deployed
     * @param cdkUtilsJsonData
     */
    getStacksToDestroy(cdkUtilsJsonData: X): string[]

    /**
     * Override this method to write custom source to identify stacks that need to be deployed
     * @param cdkUtilsJsonData
     */
    getBucketsToEmpty(cdkUtilsJsonData: X): string[]

    /**
     * Override this method to write custom source to identify stacks that need to be deployed
     * @param cdkUtilsJsonData
     */
    getAuroraDbToModifyDeleteProtection(cdkUtilsJsonData: X): string[]

    /**
     * Override this method to create a custom stack naming strategy when deploying
     * @param deploymentOptions
     * @param stackName
     */
    generateStackNameForDeploy(deploymentOptions: K, stackName: string): string;

    /**
     * Override this method to create a custom stack naming strategy when destroying
     * @param destroyOptions
     * @param stackName
     */
    generateStackNameForDestroy(destroyOptions: V, stackName: string): string;

    /**
     * Override this method to create a custom stack naming strategy for buckets
     * @param destroyOptions
     * @param bucketName
     */
    generateStackNameForBuckets(destroyOptions: V, bucketName: string): string;

    /**
     * Override this method to create a custom stack naming strategy for aurora db
     * @param destroyOptions
     * @param dbName
     */
    generateStackNameForAurora(destroyOptions: V, dbName: string): string;

    /**
     * Override this method to create a custom stack naming strategy for dynamo db
     * @param destroyOptions
     * @param dbName
     */
    generateStackNameForDynamo(destroyOptions: V, dbName: string): string;
}
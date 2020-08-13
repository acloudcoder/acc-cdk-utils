import {BuildOptions} from "../options/BuildOptions";
import {PropertyOptions} from "../options/PropertyOptions";

var AWS = require('aws-sdk-proxy');
const fs = require('fs');

/**
 * ECR CDK Utils Interface
 */
export interface StackCDKUtils {
}

/**
 * ECR Core Utility Functions for CDK
 * @author Akshay Malik
 */
export class ECRCDKUtils {
    /**
     * Method to add image property
     * @param propertyName
     * @param repositoryName
     * @param buildOptions
     */
    public addImageProperty(propertyName: string, repositoryName: string, buildOptions: BuildOptions) {
        console.log("Got request to fetch label for repository: " + repositoryName + " with label: " + buildOptions.label);
        var credentials = new AWS.SharedIniFileCredentials({profile: buildOptions.profile});
        AWS.config.credentials = credentials;
        if (repositoryName) {
            var params = {
                imageIds: [
                    {
                        imageTag: buildOptions.label
                    }
                ],
                repositoryName: repositoryName
            };
            var ecr = new AWS.ECR({
                apiVersion: '2015-09-21',
                credentials: credentials,
                region: buildOptions.region,
                logger: console
            });
            ecr.batchGetImage(params, function (err: { stack: any; }, data: { images: { imageId: { imageDigest: string; }; }[]; }) {
                if (err) {
                    console.log(err, err.stack);
                } // an error occurred
                else {
                    data.images?.forEach((image: { imageId: { imageDigest: string; }; }) => {
                        console.log("Found image digest : " + image.imageId?.imageDigest);
                        let propertyOptions = new PropertyOptions("null", "null", "null");
                        console.log("Adding image digest for property : " + propertyName + " in property file : ");
                        fs.appendFile(propertyOptions.applicationPropertyPath, "\n" + propertyName + "=" + image.imageId?.imageDigest, function (err: any) {
                            if (err) throw err;
                            console.log('Added : ' + propertyName + " with value : " + image.imageId?.imageDigest);
                        });
                    });
                }
            });
        } else {
            throw Error("Repository name not found..please check");
        }
    }
}
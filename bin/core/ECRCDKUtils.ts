import {BuildOptions} from "../options/BuildOptions";
const AWS = require('aws-sdk-proxy');
const fs = require('fs');
const path = require("path");
/**
 * ECR CDK Utils Interface
 */
export interface StackCDKUtils {
}

/**
 * ECR Core Utility Functions for CDK
 * @author acloudcoder
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
        const credentials = new AWS.SharedIniFileCredentials({profile: buildOptions.profile});
        let absolutePath: string;
        //checking if path is absolute or relative
        if (path.isAbsolute(buildOptions.applicationPropertyPath)) {
            console.log("Path is absolute..using the same..");
            absolutePath = buildOptions.applicationPropertyPath;
        } else {
            console.log("Path is relative..converting to absolute path: ");
            absolutePath = path.resolve(__dirname, buildOptions.applicationPropertyPath);
        }
        console.log("Absolute Path is: " + absolutePath);
        if (path.isAbsolute(absolutePath)) {
            if (fs.existsSync(absolutePath)) {
                console.log("Application property file exist..");
                console.log("Now fetching image digest..");
                AWS.config.credentials = credentials;
                if (repositoryName) {
                    const params = {
                        imageIds: [
                            {
                                imageTag: buildOptions.label
                            }
                        ],
                        repositoryName: repositoryName
                    };
                    const ecr = new AWS.ECR({
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
                                console.log("Adding image digest for property : " + propertyName + " in property file : ");
                                fs.appendFile(absolutePath, "\n" + propertyName + "=" + image.imageId?.imageDigest, function (err: any) {
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
        } else {
            throw Error("Path not absolute..exiting..");
        }
    }
}
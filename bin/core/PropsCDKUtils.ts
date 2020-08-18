import {DeploymentOptionsEnum, PropertyOptions} from "../options/PropertyOptions";
import {isEmpty} from "aws-cdk/lib/util";

const path = require("path");
const fs = require('fs');
const properties = require('java-properties');

/**
 * Props CDK Utils Interface
 */
export interface PropsCDKUtils {
}

/**
 * Props  Core Utility Functions for CDK
 * @author acloudcoder
 */
export class PropsCDKUtils {
    /**
     * Method to handle properties
     * @param propertyOptions
     */
    public handleProperties(propertyOptions: PropertyOptions): void {
        let absolutePath;
        //checking if path is absolute or relative
        if (path.isAbsolute(propertyOptions.sourcePropertyPath)) {
            console.log("Path is absolute..using the same..");
            absolutePath = propertyOptions.sourcePropertyPath;
        } else {
            console.log("Path is relative..converting to absolute path: ");
            absolutePath = path.resolve(__dirname, propertyOptions.sourcePropertyPath);
        }
        console.log("Absolute Path: " + absolutePath);
        let fileToCheck;
        //if deployment from job then always check external properties
        if (propertyOptions.deployment == DeploymentOptionsEnum.DEPLOY_JOB.valueOf()) {
            fileToCheck = propertyOptions.env.toUpperCase()
        }
        //else check internal props
        else if (propertyOptions.deployment == DeploymentOptionsEnum.LOCAL.valueOf()) {
            fileToCheck = "application_" + propertyOptions.component.toUpperCase()
        }
        if (path.isAbsolute(absolutePath)) {
            console.log("Absolute path found...checking if directory structure exist.. ");
            //check if dir exist
            if (fs.existsSync(absolutePath)) {
                console.log("Directory exist..");
                console.log("Checking if env property file exist..");
                let filePath = absolutePath + "/" + fileToCheck + ".properties";
                //checking if property file exist
                if (fs.existsSync(filePath)) {
                    console.log("File : " + filePath + " exist..");
                    console.log("Reading properties..");
                    let values = properties.of(path.resolve(__dirname, filePath));
                    console.log("Total properties found in file :  " + path.parse(filePath).base + " is :" + values.getKeys().length);
                    //env specific properties
                    let propertySet = new Set<string>();
                    for (let key of values.getKeys()) {
                        if (key.includes(propertyOptions.component.toUpperCase())) {
                            propertySet.add(key);
                        }
                    }
                    if (propertyOptions.matchProperties) {
                        console.log("Matching component properties and env properties");
                        //match properties with component properties
                        this.matchPropertiesWithComponentProperties(propertySet, propertyOptions);
                    }

                    //if property found...truncate application.properties
                    if (propertySet) {
                        console.log("Truncating contents of application properties : " + propertyOptions.applicationPropertyPath);
                        //checking if permissions exist. If not , give write permissions.
                        fs.access(propertyOptions.applicationPropertyPath, fs.constants.R_OK | fs.constants.W_OK, (err: any) => {
                            if (err) {
                                console.log("Permissions doesn't exist" + propertyOptions.applicationPropertyPath);
                                console.log("Giving write permissions for : " + propertyOptions.applicationPropertyPath);
                                fs.chmodSync(propertyOptions.applicationPropertyPath, "777");
                            } else {
                                console.log('can read/write : ' + propertyOptions.applicationPropertyPath);
                            }
                        });
                        //truncate file
                        fs.writeFile(propertyOptions.applicationPropertyPath, '', function () {
                            console.log('Truncated Successfully: ' + propertyOptions.applicationPropertyPath)
                        });
                        console.log("Preparing application properties..");
                        //add properties to application.properties
                        propertySet.forEach(function (property) {
                            fs.appendFile(propertyOptions.applicationPropertyPath, "\n" + (!isEmpty(property) ? property.toString().replace(propertyOptions.component.toUpperCase() + ".", "") : "") + "=" +
                                values.get(property), function (err: any) {
                                if (err) throw err;
                            });
                        })
                    }
                    console.log("Total properties found for component: " + propertyOptions.component + " is : " + propertySet.size)
                } else {
                    throw Error("Required properties file : " + fileToCheck + ".properties " + " in directory : " + absolutePath + " not found")
                }
            } else {
                throw Error("Directory : " + absolutePath + " doesnt exist..please check")
            }
        } else {
            throw Error("Path is not absolute...please check.." + absolutePath)
        }
    }

    /**
     * Method to match env properties with component specific properties
     * @param envProperties
     * @param propertyOptions
     */
    private matchPropertiesWithComponentProperties(envProperties: Set<string>, propertyOptions: PropertyOptions) {
        let absolutePath;
        if (path.isAbsolute(propertyOptions.componentPropertyPath)) {
            console.log("Path is absolute..using the same..");
            absolutePath = propertyOptions.componentPropertyPath;
        } else {
            console.log("Path is relative..converting to absolute path: ");
            absolutePath = path.resolve(__dirname, propertyOptions.componentPropertyPath);
        }
        //check if dir exist
        if (fs.existsSync(absolutePath)) {
            console.log("Directory exist : " + absolutePath);
            console.log("Checking if env property file exist for env : " + propertyOptions.env);
            let filePath = absolutePath + "/application_" + propertyOptions.component.toUpperCase() + ".properties";

            //checking if property file exist
            if (fs.existsSync(filePath)) {
                console.log("File : " + filePath + " exist..");
                console.log("Reading properties..");
                let values = properties.of(path.resolve(__dirname, filePath));
                console.log("Total properties found in file :   " + path.parse(filePath).base + " is :" + values.getKeys().length);

                let componentProperties = new Set<string>();
                for (let key of values.getKeys()) {
                    componentProperties.add(key);
                }
                console.log("Total number of component: " + propertyOptions.component + " properties: " + componentProperties.size);
                console.log("Total number of env properties : " + envProperties.size);
                console.log("Comparing both to check if any property is missing in env property for component : " + propertyOptions.component);
                let notFound = new Set();
                componentProperties.forEach(function (property: string) {
                    if (!envProperties.has(property)) {
                        notFound.add(property)
                    }
                });
                if (notFound.size > 0) {
                    console.log("Properties missing in env : " + propertyOptions.env + "  properties file: ");
                    notFound.forEach(prop => console.log(prop));
                    throw Error("Properties missing in env property file for env: " + propertyOptions.env);
                }
            } else {
                throw Error("Component property not found..." + filePath);
            }
        } else {
            throw Error("Component properties directory not found..." + propertyOptions.componentPropertyPath);
        }
    }
}
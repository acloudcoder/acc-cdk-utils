import {LambdaInvokeOptions} from "../options/LambdaInvokeOptions";
import {IndexCRUDOptions} from "../options/IndexCRUDOptions";

const request = require('superagent');
const logger = require('superagent-logger');

/**
 * Support CDK Utils Interface
 */
export interface SupportCDKUtils {
}

/**
 * Support Core Utility Functions for CDK
 * @author Akshay Malik
 */
export class SupportCDKUtils {

    /**
     * Method to do health check for support API
     * @param fullUrl
     * @param retryCount
     * @param maxCount
     * @param username
     * @param password
     */
    private async heathCheck(fullUrl: string, retryCount: number, maxCount: number, username: string, password: string): Promise<boolean> {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        var proxy = process.env.http_proxy;
        console.log("Proxy found: " + proxy);
        let returnValue: boolean = false;
        for (var _i = retryCount + 1; _i <= maxCount; _i++) {
            console.log("Health check : " + _i);
            try {
                const authorization = "Basic ".concat(Buffer.from(username + ":" + password).toString('base64'));
                const response = await request.get(fullUrl.concat("/swagger-ui.html"))
                    .set({'Content-Type': 'application/json', 'Authorization': authorization})
                    .use(logger)
                    .proxy(proxy);
                console.log("Response: " + response.status);
                return true;
            } catch (error) {
                console.log("Error: " + error);
            }
        }
        return returnValue;
    }

    /**
     * Method to invoke a lambda
     * @param lambdaInvokeOptions
     */
    public async invokeSupportLambda(lambdaInvokeOptions: LambdaInvokeOptions) {
        try {
            let secured: boolean = true;
            let fullUrl: string = "";
            if (lambdaInvokeOptions.env == "LOCAL") {
                secured = false;
                fullUrl = secured ? "https://" : "http://"
                    .concat("localhost:8080")
            } else {
                fullUrl = (secured ? "https://" : "http://")
                    .concat(lambdaInvokeOptions.env.toLowerCase())
                    .concat("-")
                    .concat("support")
                    .concat("-")
                    .concat(lambdaInvokeOptions.application.toLowerCase())
                    .concat("-")
                    .concat(lambdaInvokeOptions.component.toLowerCase())
                    .concat(".")
                    .concat(lambdaInvokeOptions.baseUrl);
            }
            console.log("URL is : " + fullUrl);
            console.log("Health Check initiate...");
            const healthCheck: boolean = await this.heathCheck(fullUrl, 0, 3
                , lambdaInvokeOptions.userName, lambdaInvokeOptions.password);
            console.log("Health Check done with result: " + (healthCheck ? "Healthy" : "Not-Healthy"));
            if (healthCheck) {
                console.log("Health check successful..");
                console.log("Now invoking lambda :" + lambdaInvokeOptions.lambdaRef + " with payload : " + lambdaInvokeOptions.payload);
                const fullUrlLambdaInvoke: string = fullUrl.concat("/v1/support/lambda/").concat(lambdaInvokeOptions.lambdaRef).concat("/invoke");
                const authorization = "Basic ".concat(Buffer.from(lambdaInvokeOptions.userName + ":" + lambdaInvokeOptions.password).toString('base64'));
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                var proxy = process.env.http_proxy;
                console.log("Proxy found: " + proxy);
                const response = await request.post(fullUrlLambdaInvoke)
                    .set({'Content-Type': 'application/json', 'Authorization': authorization})
                    .send(lambdaInvokeOptions.payload)
                    .use(logger)
                    .proxy(proxy)
                    .catch(function (err: string) {
                        console.error("Lambda invoke : " + lambdaInvokeOptions.lambdaRef + " has returned with error code: " + err +
                            "   ::: Please check logs for validating success for lambda ref :  " + lambdaInvokeOptions.lambdaRef)
                    })
                    .then(function () {
                        console.log("Lambda Invoke Successful")
                    });
                return true;
            } else {
                throw new Error("Health check failed...exiting")
            }
        }
            //catch exception locally and exit on exception
        catch (e) {
            console.log((<Error>e));
            process.exit(-1);
        }
    }

    /**
     * Method to create dynamo db index
     * @param indexCRUDOptions
     */
    public async createIndexDynamoDb(indexCRUDOptions: IndexCRUDOptions) {
        try {
            let secured: boolean = true;
            let fullUrl: string = "";
            if (indexCRUDOptions.env == "LOCAL") {
                secured = false;
                fullUrl = secured ? "https://" : "http://"
                    .concat("localhost:8080")
            } else {
                fullUrl = (secured ? "https://" : "http://")
                    .concat(indexCRUDOptions.env.toLowerCase())
                    .concat("-")
                    .concat("support")
                    .concat("-")
                    .concat(indexCRUDOptions.application.toLowerCase())
                    .concat("-")
                    .concat(indexCRUDOptions.component.toLowerCase())
                    .concat(".")
                    .concat(indexCRUDOptions.baseUrl);
            }
            console.log("URL is : " + fullUrl);
            console.log("Health Check initiate...");
            const healthCheck: boolean = await this.heathCheck(fullUrl, 0, 6
                , indexCRUDOptions.userName, indexCRUDOptions.password);
            console.log("Health Check done with result: " + (healthCheck ? "Healthy" : "Not-Healthy"));
            if (healthCheck) {
                console.log("Health check successful..");
                console.log("Now creating index for db name :" + indexCRUDOptions.dbName + "" + " with index : " + indexCRUDOptions.indexName);
                const fullUrlLambdaInvoke: string = fullUrl.concat("/v1/support/dynamo/").concat(indexCRUDOptions.dbName).concat("/index/" + indexCRUDOptions.indexName);
                const authorization = "Basic ".concat(Buffer.from(indexCRUDOptions.userName + ":" + indexCRUDOptions.password).toString('base64'));
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                var proxy = process.env.http_proxy;
                console.log("Proxy found: " + proxy);
                const response = await request.put(fullUrlLambdaInvoke)
                    .set({'Content-Type': 'application/json', 'Authorization': authorization})
                    .use(logger)
                    .proxy(proxy)
                    .catch(function (err: string) {
                        console.error("Index create for db name : " + indexCRUDOptions.dbName + " and with index: " + indexCRUDOptions.indexName + " has returned with error code: " + err +
                            "   ::: Please check logs for validating success.. ")
                    })
                    .then("Trigger for create index succesfull..please check logs or console to check status for new indexes");
                return true;
            } else {
                throw  new Error("Health check failed...exiting")
            }
        } catch (e) {
            console.log((<Error>e));
            process.exit(-1);
        }
    }

    /**
     * Method to delete dynamo db index
     * @param indexCRUDOptions
     */
    public async deleteIndexDynamoDb(indexCRUDOptions: IndexCRUDOptions) {
        try {
            let secured: boolean = true;
            let fullUrl: string = "";
            if (indexCRUDOptions.env == "LOCAL") {
                secured = false;
                fullUrl = secured ? "https://" : "http://"
                    .concat("localhost:8080")
            } else {
                fullUrl = (secured ? "https://" : "http://")
                    .concat(indexCRUDOptions.env.toLowerCase())
                    .concat("-")
                    .concat("support")
                    .concat("-")
                    .concat(indexCRUDOptions.application.toLowerCase())
                    .concat("-")
                    .concat(indexCRUDOptions.component.toLowerCase())
                    .concat(".")
                    .concat(indexCRUDOptions.baseUrl);
            }
            console.log("URL is : " + fullUrl);
            console.log("Health Check initiate...");
            const healthCheck: boolean = await this.heathCheck(fullUrl, 0, 3
                , indexCRUDOptions.userName, indexCRUDOptions.password);
            console.log("Health Check done with result: " + (healthCheck ? "Healthy" : "Not-Healthy"));
            if (healthCheck) {
                console.log("Health check successful..");
                console.log("Now deleting index for db name :" + indexCRUDOptions.dbName + "" + " with index : " + indexCRUDOptions.indexName);
                const fullUrlLambdaInvoke: string = fullUrl.concat("/v1/support/dynamo/").concat(indexCRUDOptions.dbName).concat("/index/" + indexCRUDOptions.indexName);
                const authorization = "Basic ".concat(Buffer.from(indexCRUDOptions.userName + ":" + indexCRUDOptions.password).toString('base64'));
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                var proxy = process.env.http_proxy;
                console.log("Proxy found: " + proxy);
                const response = await request.delete(fullUrlLambdaInvoke)
                    .set({'Content-Type': 'application/json', 'Authorization': authorization})
                    .use(logger)
                    .proxy(proxy)
                    .catch(function (err: string) {
                        console.error("Index delete for db name : " + indexCRUDOptions.dbName + " and with index: " + indexCRUDOptions.indexName + " has returned with error code: " + err +
                            "   ::: Please check logs for validating success.. ")
                    })
                    .then("Trigger for delete index succesfull..please check logs or console to check status for new indexes");
                return true;
            } else {
                throw  new Error("Health check failed...exiting")
            }
        } catch (e) {
            console.log((<Error>e));
            process.exit(-1);
        }
    }
}

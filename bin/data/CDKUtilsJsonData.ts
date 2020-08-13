import {JsonObject, JsonProperty} from "json2typescript";

@JsonObject("CDKUtilsJsonData")
export class CDKUtilsJsonData {

    @JsonProperty("cloudformationToUse", String)
    cloudformationToUse: any = undefined;

    @JsonProperty("component", String)
    component: any = undefined;

    @JsonProperty("stacksToDeploy", String)
    stacksToDeploy: any = undefined;

    @JsonProperty("stacksToDeploy_noEnvSpecific", String)
    stacksToDeploy_noEnvSpecific: any = undefined;

    @JsonProperty("stacksToDeploy_noEnvSpecific_noComponentSpecific", String)
    stacksToDeploy_noEnvSpecific_noComponentSpecific: any = undefined;

    @JsonProperty("stacksToDestroy", String)
    stacksToDestroy: any = undefined;

    @JsonProperty("stacksToDestroy_database", String)
    stacksToDestroy_database: any = undefined;

    @JsonProperty("s3toEmpty", String)
    s3toEmpty: any = undefined;
}
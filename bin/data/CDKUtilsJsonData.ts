import {JsonObject, JsonProperty} from "json2typescript";

/**
 * CDK Utils Json data
 * @author acloudcoder
 */
@JsonObject("CDKUtilsJsonData")
export class CDKUtilsJsonData {

    @JsonProperty("application", String)
    application: any = undefined;

    @JsonProperty("cloudformationToUse", String)
    cloudformationToUse: any = undefined;

    @JsonProperty("variant", String)
    variant: any = undefined;

    @JsonProperty("stacksToDeploy", String)
    stacksToDeploy: any = undefined;

    @JsonProperty("stacksToDeploy_noEnvSpecific", String)
    stacksToDeploy_noEnvSpecific: any = undefined;

    @JsonProperty("stacksToDeploy_noEnvSpecific_noVariantSpecific", String)
    stacksToDeploy_noEnvSpecific_noVariantSpecific: any = undefined;

    @JsonProperty("stacksToDestroy", String)
    stacksToDestroy: any = undefined;

    @JsonProperty("stacksToDestroy_database", String)
    stacksToDestroy_database: any = undefined;

    @JsonProperty("auroraToModifyDeleteProtection", String)
    auroraToModifyDeleteProtection: any = undefined;

    @JsonProperty("s3toEmpty", String)
    s3toEmpty: any = undefined;
}
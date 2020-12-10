import {JsonObject} from "json2typescript";

/**
 * Pojo class for Approval Options
 * @author acloudcoder
 */
export enum ApprovalOptions {
    NEVER = "never",
    ANY_CHANGE = "any-change",
    BROADENING = "broadening"
}

export class DeploymentOptions {

    public deployment: string;
    public env: string;
    public variant: string;
    public application: string;
    public trace: boolean;
    public verbose: boolean;
    public profile: string;
    public force: boolean;
    public executeChangeSet: boolean;
    public proxy: boolean;
    public ec2Cred: boolean;
    public requiresApproval: string;
    public stackSeparator: string;
    public silent: boolean;
    public label: string;
    public notificationArn: string;
    public toolkitStackName: string;
    public toolkitBucketName: string;

    constructor(env: string, variant: string, application: string) {
        this.env = env;
        this.variant = variant;
        this.application = application
    }

    protected static DefaultInit = (() => {
        DeploymentOptions.prototype.application = "APP";
        DeploymentOptions.prototype.stackSeparator = "-";
        DeploymentOptions.prototype.trace = true;
        DeploymentOptions.prototype.verbose = true;
        DeploymentOptions.prototype.profile = "default";
        DeploymentOptions.prototype.force = true;
        DeploymentOptions.prototype.executeChangeSet = true;
        DeploymentOptions.prototype.proxy = false;
        DeploymentOptions.prototype.ec2Cred = false;
        DeploymentOptions.prototype.requiresApproval = ApprovalOptions.NEVER.valueOf();
        DeploymentOptions.prototype.silent = false;
        DeploymentOptions.prototype.label = "latest";
        DeploymentOptions.prototype.deployment = "NONPROD";
        DeploymentOptions.prototype.notificationArn = "";
    })();
}
export enum ApprovalOptions {
    NEVER = "never",
    ANY_CHANGE = "any-change",
    BROADENING = "broadening"
}

/**
 * POJO class for Destroy Options
 * @author acloudcoder
 */
export class DestroyOptions {
    public deployment: string;
    public env: string;
    public variant: string;
    public application: string;
    public destroyDatabaseStack: boolean;
    public destroyStack: boolean;
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

    constructor(env: string, variant: string, application: string) {
        this.env = env;
        this.variant = variant;
        this.application = application;
    }

    protected static DefaultInit = (() => {
        DestroyOptions.prototype.application = "APP";
        DestroyOptions.prototype.stackSeparator = "-";
        DestroyOptions.prototype.trace = true;
        DestroyOptions.prototype.verbose = true;
        DestroyOptions.prototype.deployment = "NONPROD";
        DestroyOptions.prototype.profile = "default";
        DestroyOptions.prototype.force = true;
        DestroyOptions.prototype.executeChangeSet = true;
        DestroyOptions.prototype.proxy = false;
        DestroyOptions.prototype.ec2Cred = false;
        DestroyOptions.prototype.requiresApproval = ApprovalOptions.NEVER.valueOf();
        DestroyOptions.prototype.silent = true;
        DestroyOptions.prototype.destroyStack = true;
        DestroyOptions.prototype.destroyDatabaseStack = true;
    })();
}
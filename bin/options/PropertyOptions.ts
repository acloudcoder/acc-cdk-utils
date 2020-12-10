export enum DeploymentOptionsEnum {
    LOCAL = "local",
    DEPLOY_JOB = "DEPLOY_JOB"
}

/**
 * POJO Class for Env functions
 * @author acloudcoder
 */
export class PropertyOptions {
    public deployment: string;
    public applicationPropertyPath: string;
    public variantPropertyPath: string;
    public sourcePropertyPath: string;
    public env: string;
    public variant: string;
    public matchProperties: boolean;

    constructor(env: string, variant: string, sourcePropertyPath: string, variantPropertyPath: string, applicationPropertyPath: string) {
        this.env = env;
        this.variant = variant;
        this.sourcePropertyPath = sourcePropertyPath;
        this.variantPropertyPath = variantPropertyPath;
        this.applicationPropertyPath = applicationPropertyPath
    }

    protected static DefaultInit = (() => {
        PropertyOptions.prototype.matchProperties = true;
        PropertyOptions.prototype.deployment = DeploymentOptionsEnum.DEPLOY_JOB.valueOf()
    })();
}
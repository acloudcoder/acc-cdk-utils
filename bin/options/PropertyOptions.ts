export enum DeploymentOptionsEnum {
    LOCAL = "local",
    DEPLOY_JOB = "DEPLOY_JOB"
}

/**
 * POJO Class for Env functions
 * @author Akshay Malik
 */
export class PropertyOptions {
    public deployment: string;
    public applicationPropertyPath: string;
    public componentPropertyPath: string;
    public sourcePropertyPath: string;
    public env: string;
    public component: string;
    public matchProperties: boolean;

    constructor(env: string, component: string, sourcePropertyPath: string) {
        this.env = env;
        this.component = component;
        this.sourcePropertyPath = sourcePropertyPath;
    }

    protected static DefaultInit = (() => {
        PropertyOptions.prototype.applicationPropertyPath = "./properties/application.properties";
        PropertyOptions.prototype.componentPropertyPath = "./../../properties/components/.";
        PropertyOptions.prototype.matchProperties = true;
        PropertyOptions.prototype.deployment = DeploymentOptionsEnum.DEPLOY_JOB.valueOf()
    })();
}
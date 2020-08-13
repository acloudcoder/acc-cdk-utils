/**
 * POJO Class for invoking lambda
 */
export class LambdaInvokeOptions {
    public env: string;
    public component: string;
    public application: string;
    public baseUrl: string;
    public lambdaRef: string;
    public payload: string;
    public userName: string;
    public password: string;

    constructor(env: string, component: string, application: string) {
        this.env = env;
        this.component = component;
        this.application = application
    }

    protected static DefaultInit = (() => {
        LambdaInvokeOptions.prototype.baseUrl = "baseUrl.com";
        LambdaInvokeOptions.prototype.userName = "user";
        LambdaInvokeOptions.prototype.password = "pass";
        LambdaInvokeOptions.prototype.payload = "{}"
    })();
}
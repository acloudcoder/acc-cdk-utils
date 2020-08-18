/**
 * POJO Class for Build Options
 * @author acloudcoder
 */
export class BuildOptions {

    public label: string;
    public profile: string;
    public region: string;
    public applicationPropertyPath: string;

    constructor(applicationPropertyPath: string) {
        this.applicationPropertyPath = applicationPropertyPath
    }

    protected static DefaultInit = (() => {
        BuildOptions.prototype.label = "latest";
        BuildOptions.prototype.profile = "default";
        BuildOptions.prototype.region = "ap-southeast-2";
    })();
}
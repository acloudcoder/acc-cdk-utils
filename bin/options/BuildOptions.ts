/**
 * POJO Class for Build Options
 * @author Akshay Malik
 */
export class BuildOptions {

    public label: string;
    public profile: string;
    public region: string;

    protected static DefaultInit = (() => {
        BuildOptions.prototype.label = "latest";
        BuildOptions.prototype.profile = "default";
        BuildOptions.prototype.region = "ap-southeast-2";
    })();
}
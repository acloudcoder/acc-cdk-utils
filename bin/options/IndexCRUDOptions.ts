/**
 * POJO Class for Index CRUD Options
 */
export class IndexCRUDOptions {
    public env: string;
    public component: string;
    public application: string;
    public baseUrl: string;
    public dbName: string;
    public indexName: string;
    public userName: string;
    public password: string;

    constructor(env: string, component: string, application: string) {
        this.env = env;
        this.component = component;
        this.application = application
    }

    protected static DefaultInit = (() => {
        IndexCRUDOptions.prototype.baseUrl = "baseUrl.com";
        IndexCRUDOptions.prototype.userName = "user";
        IndexCRUDOptions.prototype.password = "pass";
        IndexCRUDOptions.prototype.dbName = "ALL";
        IndexCRUDOptions.prototype.indexName = "ALL"
    })();
}
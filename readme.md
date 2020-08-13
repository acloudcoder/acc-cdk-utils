# CDK Utils

CDK Utils is a Typescript library for dealing with cdk deployments.This is a framework that can be adopted and used to do enterprise level CDK deployments.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/acc-cdk-utils) to use this framework.

```bash
npm install acc-cdk-utils
```
## Data
```
[
  {
    "component": "Component1",
    "stacksToDeploy": "StackS3,StackSQS,StackLambda",
    "stacksToDeploy_noEnvSpecific" : "StackCognito,StackLambda",
    "stacksToDeploy_noEnvSpecific_noAssetSpecific":"StackRoute53",
    "cloudformationToUse": "node bin/cloudformation.js",
    "stacksToDestroy": "StackS3,StackSQS,StackLambda",
    "stacksToDestroy_database": "StackDB",
    "s3toEmpty": "bucketName"
  }
]
```

## Usage

```typescript

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
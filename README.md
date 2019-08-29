# meli-xmen-rest-API *CHALLENGE*

A serverless mutant DNA analyzer REST API written in JavaScript (nodeJs v8.10) for AWS cloud.

![basic architecture](https://raw.githubusercontent.com/RPM8887/MeLi-xmen/master/basic_arch.png)

## AWS Services used by the project
The following services are used either directly or indirectly by the project
- CloudFormation
- S3
- API Gateway
- Lambda
- DynamoDB
- CloudWatch

## Running/testing the API
The API is currently published under the following endpoints:
  >POST - https://nqao9fdx9a.execute-api.us-east-1.amazonaws.com/dev/mutant
  >
  >GET - https://nqao9fdx9a.execute-api.us-east-1.amazonaws.com/dev/stats
### Sample input data
Valid input json messages for DNA analysis are provided inside **/test/*.json**
There's also sample data from DynamoDB of a couple of test runs inside **/sample_data/sample_meli-xmen-rest-api-dev.csv**
### Sample output
Mutant DNA - HTTP 200
```
{
    "id": "4606cd60-ca0c-11e9-880d-19af2e5d92fe",
    "dnaSequence": [
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG"
    ],
    "mutant": 1
}
```
Human DNA - HTTP 403
```
{
    "id": "501f2ef0-ca0c-11e9-880d-19af2e5d92fe",
    "dnaSequence": [
        "ATGCGA",
        "CAGTGC",
        "TTATTT",
        "AGACGG",
        "GCGTCA",
        "TCACTG"
    ],
    "mutant": 0
}
```
Stats - HTTP 200
```
{
    "count_mutant_dna": 13,
    "count_human_dna": 4,
    "ratio": 3.25
}
```




## Deploying the API from scratch
The API was built taking advantage of the serverless framework. Hence, deployment is rather easy.

Install the serverless framework
```
npm install -g serverless
```

Go to the root directory of the project and deploy the API
```
serverless deploy -v
```
For further info visit: [https://serverless.com/framework/docs/providers/aws/](https://serverless.com/framework/docs/providers/aws/)




## What's missing?
- Test cases were not coded due to lack of time, but json input messages for the different mutant strands are provided.
- Validation of any kind: input messages are not being validated (eg.: expected json; valid DNA strands; etc.)
- Performance: since the API was built using a serverless architecture, it's highly scalable and should be able to handle heavy loads. Nonetheless, further fine-tuning can be done to make it even more reliable and increase it's performance such as:
	- Enable cache in AWS API Gateway for GET methods
	- Enable DAX for DynamoDB
	- Review function logic
- Resiliency
- ...and many other features
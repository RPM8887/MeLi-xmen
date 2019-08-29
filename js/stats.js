'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.getStats = (event, context, callback) => {
  
  //Use promises to obtain mutant & human count before sending the response
  Promise.all([mutantCountPromise(),humanCountPromise()]).then(function(values) {
    console.log("VALUES: "+values);
    var ratio = 1;
    if(values[1] != 0 )
      ratio = values[0]/values[1];
    var jsonString = '{"count_mutant_dna":'+values[0]+', "count_human_dna":'+values[1]+', "ratio":'+ ratio +'}';
    
    // create a response
    const response = {
      statusCode: 200,
      body: jsonString,
    };

    callback(null, response);
  }, function(err) {
    console.log(err);
    var jsonString = '{"Error":"'+err+'"}'
    
    // create a response
    const response = {
      statusCode: 500,
      body: jsonString,
    };

    callback(null, response);
  });

};


function humanCountPromise() {
  //Create params for human count
  const params_human = {
    TableName: process.env.DYNAMODB_TABLE,
    Select: 'COUNT',
    IndexName: "mutant-index",
    KeyConditionExpression: "mutant = :isMutant",
    ExpressionAttributeValues: {
        ":isMutant": 0
    },
  };

  // Return new promise 
  return new Promise(function(resolve, reject) {
    // Do async job
    dynamoDb.query(params_human, function(error, data) {
      // handle potential errors
      if (error) {
        reject(error);
      } else {
        console.log('HUMANS '+data.Count);
        resolve(data.Count);
      }
    });
  })

};

function mutantCountPromise() {
  //Create params for mutant count
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Select: 'COUNT',
    IndexName: "mutant-index",
    KeyConditionExpression: "mutant = :isMutant",
    ExpressionAttributeValues: {
        ":isMutant": 1
    },
  };

  // Return new promise 
  return new Promise(function(resolve, reject) {
    // Do async job
    dynamoDb.query(params, function(error, data) {
      // handle potential errors
      if (error) {
        reject(error);
      } else {
        console.log('MUTANTS '+data.Count);
        resolve(data.Count);
      }
    });
  })

};
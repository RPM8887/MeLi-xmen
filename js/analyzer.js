'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.analyze = (event, context, callback) => {
  
  var jsonInput = JSON.parse(event.body);
  var dnaMatrix = jsonInput.dna; // TODO: Validate if DNA input is valid
  var mutant = isMutant(dnaMatrix);

  console.log("dnaMatrix = " + dnaMatrix);
  console.log("mutant = " + mutant);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      dnaSequence: dnaMatrix,
      mutant: mutant ? 1 : 0,
    },
  };

  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      params.Item.Error = error;
      callback(null, {
        statusCode: mutant ? 200 : 403,
        body: JSON.stringify(params.Item),
      });
      return;
    }

    // create a response; send HTTP200 if mutant OR 403 if not mutant
    const response = {
      statusCode: mutant ? 200 : 403,
      body: JSON.stringify(params.Item),
    };

    callback(null, response);
  });

};

function isMutant(matrix) {
  // TODO: Avoid cycling through the whole matrix. Certain positions
  for (var column = 0; column < matrix[0].length; column++) {
    for (var row = 0; row < matrix.length; row++) {
      if (matchDiagonallyLeft(matrix, row, column) || matchDiagonallyRight(matrix, row, column) || matchVertically(matrix, row, column) || matchHorizontally(matrix, row, column)) {
        return true;
      }
    }
  }

  return false;
};

function matchHorizontally(matrix, row, column) {
  if (!(matrix[row] && matrix[row][column+3]))
    return false;
  else {
    if (matrix[row][column] == matrix[row][column + 1] && matrix[row][column] == matrix[row][column + 2] && matrix[row][column] == matrix[row][column + 3])
      return true;
    else
      return false;
  }
};


function matchVertically(matrix, row, column) {
  if (!(matrix[row+3] && matrix[row+3][column]))
    return false;
  else {
    if (matrix[row][column] == matrix[row + 1][column] && matrix[row][column] == matrix[row + 2][column] && matrix[row][column] == matrix[row + 3][column])
      return true;
    else
      return false;
  }
};

function matchDiagonallyRight(matrix, row, column){

  if (!(matrix[row+3] && matrix[row+3][column+3]))
    return false;
  else {
    if (matrix[row][column] == matrix[row + 1][column + 1]
      && matrix[row][column] == matrix[row + 2][column + 2]
      && matrix[row][column] == matrix[row + 3][column + 3])
      return true;
    else
      return false;
  }
};

function matchDiagonallyLeft(matrix, row, column){
  if (!(matrix[row+3] && matrix[row+3][column-3]))
    return false;
  else {
    if (matrix[row][column] == matrix[row + 1][column - 1]
      && matrix[row][column] == matrix[row + 2][column - 2]
      && matrix[row][column] == matrix[row + 3][column - 3])
      return true;
    else
      return false;
  }
};
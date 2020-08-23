const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler =  (event, context, callback) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  // Get the http method
  const httpMethod = event.httpMethod;
  switch(httpMethod) {
    case "POST":
      createOrder(event,callback);
      break;
    case "PUT":
      updateOrder(event,callback);
      break;
    default:
      // code block
  }
};

/**
 * Create the order
 * @param event
 * @param callback
 */
const createOrder = function (event,callback) {
  console.log("Entered the order creation method");
  // Get the order Id
  const orderId = event.requestContext.requestId;

  // Create the Params object
  var params = {
    TableName : process.env.TABLE_NAME,
    Item: {
      orderId: orderId,
      userId: JSON.parse(event.body).userId,
      lineItems: JSON.parse(event.body).lineItems,
      orderTotal: JSON.parse(event.body).total,
      orderStatus: 'in-progress'
    }
  };

  // Save the item to Dynamo
  documentClient.put(params, function(err, data) {
    if (err) {
      console.log(err);
      return callback(Error(err));
    } else {
      console.log(data);
      const methodResponse = {
        message: "The order was created successfully - " + orderId
      }
      const apiGatewayResponse = {
        statusCode: 201,
        body: JSON.stringify(methodResponse)
      }
      return callback(null,apiGatewayResponse);
    }
  });

};

/**
 * Just update the order status
 * @param event
 * @param callback
 */
const updateOrder = function (event,callback) {
  console.log("Entered the order update method");
  // Get the order Id from the path params
  const orderId = event.pathParameters.orderId;

  // Create the Params object
  var params = {
    TableName : process.env.TABLE_NAME,
    Key: { orderId : orderId },
    UpdateExpression: 'set #orderStatus = :completed',
    ExpressionAttributeNames: {'#orderStatus' : 'orderStatus'},
    ExpressionAttributeValues: {
      ':completed' : "completed"
      }
  };

  // Update the item to Dynamo
  documentClient.update(params, function(err, data) {
    if (err) {
      console.log(err);
      return callback(Error(err));
    } else {
      console.log(data);
      const methodResponse = {
        message: "The order was delivered successfully - " + orderId
      }
      const apiGatewayResponse = {
        statusCode: 201,
        body: JSON.stringify(methodResponse)
      }
      return callback(null,apiGatewayResponse);
    }
  });

};
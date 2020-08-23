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
    default:
      // code block
  }
};

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
      menuItems: JSON.parse(event.body).lineItems,
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
        statusCode: 200,
        body: JSON.stringify(methodResponse)
      }
      return callback(null,apiGatewayResponse);
    }
  });

};
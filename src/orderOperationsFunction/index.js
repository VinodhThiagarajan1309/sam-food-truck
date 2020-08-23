const AWS = require('aws-sdk')

exports.handler = async (event, context, callback) => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  const tableName = process.env.TABLE_NAME;
  const httpMethod = event.httpMethod; //POST
  const requestId = event.requestContext.requestId;
  const userId = "sampleUserUUID";
  const orderTotal = 14.99;

  const lineItems = [
    {
      itemId: "someUUID",
      itemName : "Burger",
      itemPrice: 2.99
    },
    {
      itemId: "someUUID2",
      itemName : "IceCream",
      itemPrice: 3.99
    },
    {
      itemId: "someUUID3",
      itemName : "Coke",
      itemPrice: 4.99
    },
  ];

  /**
   * orderid
   * userId
   * list of items
   * total
   * orderstatus
   *
   */


  var params = {
    TableName : tableName,
    Item: {
      orderId: requestId,
      userId: userId,
      menuItems: lineItems,
      orderTotal: orderTotal,
      orderStatus: 'in-progress'
    }
  };

  const documentClient = new AWS.DynamoDB.DocumentClient();

  documentClient.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
  });

  const sample = {
    statusCode : 200,
    body : " All Good Vinodh !!"
  }
  callback(null,sample);
};

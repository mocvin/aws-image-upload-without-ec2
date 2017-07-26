var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });
var urlPrefix = 'https://s3-eu-west-1.amazonaws.com/github.beyondtech.it/';

console.log('Loading event');

exports.handler = function (event, context, callback) {
  var key = new Date().toISOString().substr(0, 10) + '/' + String(Date.now());

  //console.log("Event:" + JSON.stringify(event));
  var body = JSON.parse(event.body);
  if (!body.hasOwnProperty('contentType')) {
    callback('no content type specified')
  } else if (!body.contentType.match(/(\.|\/)(gif|jpe?g|png)$/i)) {
    callback('invalid content type, gif, jpg, and png supported');
  }

  console.log('Event Type: ' + body.contentType);

  var params = {
    Bucket: 'github.beyondtech.it',
    Key: key,
    Body: '',
    ContentType: body.contentType,
    Expires: 60
  };

  s3.getSignedUrl('putObject', params, function (err, url) {
    console.log('The URL is', url);
    callback(null, {
      body: JSON.stringify({
        'oneTimeUploadUrl': url,
        'resultUrl': urlPrefix + key
      }),
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      isBase64Encoded: false
    });
  });
};
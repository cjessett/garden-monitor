const AWS = require('aws-sdk');
const AWSIoTData = require('aws-iot-device-sdk');

const { REACT_APP_ENDPOINT, REACT_APP_REGION, REACT_APP_IDENTITY_POOL_ID } = process.env;

// Initialize the Amazon Cognito credentials provider
AWS.config.region = REACT_APP_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: REACT_APP_IDENTITY_POOL_ID });

const errorHandler = err => console.error(err, err.stack);

function ValveClient({ thingName, onMessage }) {
  const clientId = `mqtt-${thingName}-${Math.floor((Math.random() * 100000) + 1)}`;

  const subTopic =`$aws/things/${thingName}/shadow/update/accepted`;
  const pubTopic =`/things/${thingName}/shadow/updateRequest`;
  const firmwareTopic =`/things/${thingName}/firmware/update`;

  this.config = { thingName, subTopic, pubTopic, firmwareTopic };
  this.iotData = new AWS.IotData({ endpoint: REACT_APP_ENDPOINT, region: REACT_APP_REGION });

  this.client = AWSIoTData.device({
     region: REACT_APP_REGION,
     host: REACT_APP_ENDPOINT,
     clientId,
     protocol: 'wss',
     maximumReconnectTimeMs: 8000,
     debug: true,
     accessKeyId: '',
     secretKey: '',
     sessionToken: ''
  });

  const cognitoIdentity = new AWS.CognitoIdentity();
  AWS.config.credentials.get((err, data) => {
     if (!err) {
        var params = {
           IdentityId: AWS.config.credentials.identityId
        };
        cognitoIdentity.getCredentialsForIdentity(params, (err, data) => {
           if (!err) {
              //
              // Update our latest AWS credentials; the MQTT client will use these
              // during its next reconnect attempt.
              //
              this.client.updateWebSocketCredentials(
                data.Credentials.AccessKeyId,
                data.Credentials.SecretKey,
                data.Credentials.SessionToken
              );
           } else {
              console.error('error retrieving credentials: ' + err);
              alert('error retrieving credentials: ' + err);
           }
        });
     } else {
        console.error('error retrieving identity:' + err);
        alert('error retrieving identity: ' + err);
     }
  });

  this.client.on('message', onMessage);
  this.client.on('error', console.error);
  this.client.subscribe(subTopic);
}

ValveClient.prototype.isValveOpen = function() {
  const { thingName } = this.config;
  return this.iotData.getThingShadow({ thingName })
    .promise()
    .then(data => {
      const { state: { reported: { valve } } } = JSON.parse(data.payload);
      return valve === 'open';
    })
    .catch(errorHandler);
}

ValveClient.prototype.toggleValve = function(valve) {
  const { thingName, pubTopic } = this.config;
  if (!(valve === 'open' || valve === 'closed')) throw new Error('Argument error');

  const shadowPayload = JSON.stringify({ state: { desired: { valve } } });
  const updatePayload = JSON.stringify({ desired: valve });
  // publish to shadow
  const update = this.iotData.updateThingShadow({ payload: shadowPayload, thingName })
    .promise()
    .catch(errorHandler);
  // publish to device (since device can't read shadow update)
  const publishUpdate = this.iotData.publish({ payload: updatePayload, topic: pubTopic })
    .promise()
    .then(console.log)
    .catch(errorHandler);

  return Promise.all([update, publishUpdate]).then(console.log)
}

ValveClient.prototype.updateFirmware = function() {
  const { firmwareTopic } = this.config;
  return this.iotData.publish({ topic: firmwareTopic }).promise().then(console.log);
}

ValveClient.prototype.end = function () {
  this.client.end();
}

export default function(config) {
  return new ValveClient(config);
}

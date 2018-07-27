require('dotenv').config();

const AWS = require('aws-sdk');
const AWSIoTData = require('aws-iot-device-sdk');

const { REACT_APP_ENDPOINT, REACT_APP_REGION, REACT_APP_SOIL_POOL_ID } = process.env;
const errorHandler = err => console.error(err, err.stack);

function SoilClient({ thingName, onConnect, onMessage }) {
  const subTopic = `$aws/things/${thingName}/shadow/update/accepted`;

  this.config = { thingName };
  this.iotData = new AWS.IotData({ endpoint: REACT_APP_ENDPOINT, region: REACT_APP_REGION });

  AWS.config.region = REACT_APP_REGION;

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: REACT_APP_SOIL_POOL_ID });

  this.client = AWSIoTData.device({
     region: REACT_APP_REGION,
     host: REACT_APP_ENDPOINT,
     clientId: `mqtt-${thingName}-${Math.floor((Math.random() * 100000) + 1)}`,
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

  this.client.on('connect', onConnect);
  this.client.on('message', onMessage);
  this.client.on('error', console.error);
  this.client.subscribe(subTopic);
}

SoilClient.prototype.getMoisture = function() {
  const { thingName } = this.config;
  return this.iotData.getThingShadow({ thingName })
    .promise()
    .then(data => {
      const { state: { reported: { moisture } }, metadata: { reported: { moisture: { timestamp } } } } = JSON.parse(data.payload);
      return { moisture, timestamp };
    })
    .catch(errorHandler);
}

SoilClient.prototype.end = function() {
  this.client.end();
}

export default function(config) {
  return new SoilClient(config)
}

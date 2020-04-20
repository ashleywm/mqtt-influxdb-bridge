# MQTT Influxdb Bridge

Node.js implementation of a MQTT to Influxdb bridge for recording sensor data transmitted over MQTT to InfluxDB

## Installation

Prerequisites
* Node.js 12 
* MQTT Broker
* InfluxDB

### Development Mode
Yarn

```
yarn install
yarn run dev
```

NPM 
```
npm install
npm run dev
```
### Production
```
ENV_VARS=something node index.js
```

## Usage

Using this MQTT bridge your message payload must have a similar schema:

```json
{"measurement": value}
```

You can have multiple measurements per payload for example:

```json
{"temperature": 21.10, "pressure": 1020, "humidity": 37}
```

Which will then be converted into the following schema and written to InfluxDB:

```json
{
  "measurement" : "temperature",
  "tags": {
    "topic": "/my-topic/sensor/bme280",
  },
  "fields": {
    "value": 21.10
   }
}...
```

NOTE: The value is expected to be a float

### Environment Variables
To use the bridge you need to set a series of environment variables:

#### InfluxDB
* ```INFLUX_HOST``` Required - defines the hostname of the Influxdb instance 
* ```INFLUX_PORT``` Default 8086 - defines the port to use to contact the Influxdb instance
* ```INFLUX_DB_NAME``` Required - database name to write to
* ```INFLUX_USERNAME``` Required -  database username to connect with
* ```INFLUX_PASSWORD``` Required - database password to connect with

#### MQTT
* ```MQTT_HOST``` Required - defines the hostname of the MQTT broker
* ```MQTT_USERNAME``` Required - MQTT username
* ```MQTT_PASSWORD``` Required - MQTT password
* ```MQTT_PROTOCOL``` Defaults to tls
* ```MQTT_TOPICS``` Required - comma seperated list of topics to listen to e.g ```MQTT_TOPICS=/topic1,/topic2``` or use ```#``` for all topics on broker


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

[MIT](LICENSE.MD)

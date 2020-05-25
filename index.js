const mqtt = require("mqtt");
const consola = require("consola");
const Influx = require("influx");

const influxOptions = {
  host: process.env.INFLUX_HOST,
  port: process.env.INFLUX_PORT || 8086,
  username: process.env.INFLUX_USERNAME,
  password: process.env.INFLUX_PASSWORD,
  database: process.env.INFLUX_DB_NAME,
};

const mqttOptions = {
  host: process.env.MQTT_HOST,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: process.env.MQTT_PROTOCOL || "tls",
};

const influx = new Influx.InfluxDB({
  ...influxOptions,
  schema: [
    {
      measurement: "parameter",
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ["topic"],
    },
  ],
});

const processMessage = (topic, message) => {
  const data = [];

  Object.keys(message).forEach((measurement) => {
    const value = message[measurement];
    data.push({
      measurement,
      tags: { topic },
      fields: { value },
    });
  });

  return data;
};

const topics = process.env.MQTT_TOPICS.split(",");

if (!topics.length) {
  consola.error("No topics to subscribe to");
}

const client = mqtt.connect(mqttOptions);

client.subscribe(topics);

client.on("connect", () => {
  consola.success("Connected to MQTT broker");
});

client.on("offline", () => {
  consola.warn("MQTT broker connection failed");
  process.exit(1);
});

client.on("error", (error) => {
  consola.error("MQTT Client Error:", error);
  process.exit(1);
});

client.on("message", (topic, message) => {
  const messageString = message.toString();
  const parsedMessage = JSON.parse(messageString);

  influx.writePoints(processMessage(topic, parsedMessage)).catch((err) => {
    consola.error(`Error saving data to InfluxDB! ${err.stack}`);
  });
});

const Rascal = require("rascal");
const config = require("./config");

//attributes the env variable to json config file
config.vhosts["/"].connection.url = process.env.AMQP_URL;

// const config = Rascal.withDefaultConfig(defaultConfig);
const publisher = Object.keys(config.vhosts["/"].publications)[0];
const consumer = Object.keys(config.vhosts["/"].subscriptions)[0];

module.exports = {
  pub: (req, res, next) =>
    Rascal.Broker.create(
      Rascal.withDefaultConfig(config),
      function (err, broker) {
        if (err) next(err);

        req.publish = (type, keys, value) =>
          new Promise((resolve, reject) => {
            // creates a message object and set its properties
            const message = {
              type,
              payload: value,
              keys,
            };

            console.log(value)

            broker.publish(publisher, message, function (err, publication) {
              if (err) reject(err);
              publication.on("error", reject);
              resolve(value);
            });
          });
          next();
      }
    ),

  sub: () =>
    Promise.resolve(Rascal.withDefaultConfig(config)).then((config) =>
      new Promise((resolve, reject) =>
        Rascal.Broker.create(config, function (err, broker) {
          if (err) {
            if (err.code === "ECONNREFUSED") {
              console.error(err);
              process.exit(1);
            } else {
              reject(err);
            }
          }
          resolve(broker);
        })
      )
        .then(
          (broker) =>
            new Promise((resolve, reject) =>
              broker.subscribe(consumer, function (err, subscription) {
                if (err) reject(err);
                resolve(subscription);
              })
            )
        )
        .then((subscription) => {
          subscription.on("error", console.error);
          subscription.on("cancel", console.warn);
          return subscription;
        })
    ),
};

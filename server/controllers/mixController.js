var axios = require("axios");
var db = require("../db").Queue;

// adds the user's funded wallet to the queue in the mongo database
var addToQueue = (req, res) => {
  db
    .update({}, { $push: { queue: req.body } }, { upsert: true })
    .then(mongoRes => {
      req.body.remainingBalance = req.body.balance;
      payCurrentUser(req.body);
      res.end();
    })
    .catch(err => res.end());
};

// pays the new user mixed coins from wallets in the queue
var payCurrentUser = user => {
  db
    .find({})
    .then(mongoRes => {
      var queue = mongoRes[0].queue;
      var indexCount = 4;

      // keep paying the user funds from the user at the front of the queue
      // until they are owed nothing
      while (user.remainingBalance) {
        // funds are sent to one of the 5 addresses, selected randomly
        var randomIndex = Math.floor(Math.random() * indexCount);
        var request = {
          fromAddress: queue[0].paymentAddress,
          toAddress: user.addresses[randomIndex]
        };

        if (queue[0].balance > user.remainingBalance) {
          request.amount = user.remainingBalance;
          user.remainingBalance = 0;
          queue[0].balance -= request.amount;
        } else {
          request.amount = queue[0].balance;
          user.remainingBalance -= request.amount;
          queue.shift();
          db.update({}, { queue }).then(res => {
            console.log(res);
          });
        }
        axios.post(
          "http://jobcoin.projecticeland.net/spoken/api/transactions",
          request
        );
      }
      db.update({}, { queue }).then(res2 => {
        console.log(res2);
      });
    })
    .catch(err => console.log(err));
};

// sums all of the coins currently in the mixer queue and returns the value
var getMaxSpend = (req, res) => {
  db.find({}).then(mongoRes => {
    res.send(
      mongoRes[0].queue.reduce((acc, cur) => acc + cur.balance, 0).toString()
    );
  });
};

module.exports = {
  addToQueue,
  payCurrentUser,
  getMaxSpend
};

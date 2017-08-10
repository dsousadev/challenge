const axios = require("axios");

// checks the payment address for the payment every 3 seconds
// stops checking when the payment is received or 5 minutes has passed
module.exports.checkPayment = user => {
  let interval = setInterval(() => {
    axios
      .get(`http://jobcoin.projecticeland.net/spoken/api/addresses/${user.paymentAddress}`)
      .then(res => {
        if (Number(res.data.balance)) {
          clearInterval(interval);
          alert(`Payment of ${res.data.balance} received. Check your wallets for mixed coins.`);
          user.balance = Number(res.data.balance);
          module.exports.addToQueue(user);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, 3000);
  setTimeout(() => clearInterval(interval), 300000);
};

// makes a request to node server to place the add the user's wallet to the queue
module.exports.addToQueue = user => {
  axios
    .post("http://localhost:3000/mix", user)
    .catch(err => {
      console.log(err);
    });
};

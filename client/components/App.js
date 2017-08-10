import React from "react";
import addressGen from "randomstring";
import axios from "axios";
import util from "../jobcoin";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      address1: "",
      address2: "",
      address3: "",
      address4: "",
      address5: "",
      showPaymentAddress: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    axios.get("http://localhost:3000/mix").then(res => {
      this.setState({ maxBalance: res.data });
    })
    .catch(err => console.log(err));
  }
  handleChange(event) {
    event.preventDefault();
    let address = event.target.id;
    this.setState({ [address]: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    let addresses = [
      this.state.address1,
      this.state.address2,
      this.state.address3,
      this.state.address4,
      this.state.address5
    ];
    if (addresses.filter(address => Boolean(address)).length !== addresses.length) {
      alert("Address fields cannot be blank");
    } else {
      this.setState({
        user: {
          paymentAddress: addressGen.generate(34),
          addresses
        },
        showPaymentAddress: true
      });
    }
  }
  render() {
    return (
      <div>
        <form className="form">
          <h1>Jobcoin Mixer</h1>
          <h2>Enter 5 Jobcoin public addresses that you control.</h2>
          <h2>
            These are where your funds will be sent after the mixing process.
          </h2>
          <input
            id="address1"
            type="text"
            value={this.state.address1}
            onChange={this.handleChange}
          />
          <input
            id="address2"
            type="text"
            value={this.state.address2}
            onChange={this.handleChange}
          />
          <input
            id="address3"
            type="text"
            value={this.state.address3}
            onChange={this.handleChange}
          />
          <input
            id="address4"
            type="text"
            value={this.state.address4}
            onChange={this.handleChange}
          />
          <input
            id="address5"
            type="text"
            value={this.state.address5}
            onChange={this.handleChange}
          />
          <input type="submit" value="Submit" onClick={this.handleSubmit} />
        </form>
        <br />
        {this.state.showPaymentAddress
          ? <div>
              <h2>
                Send your Jobcoins, within the next 5 minutes, to the following address for mixing:
              </h2>
              <h2>Do not send more than: {this.state.maxBalance} coins</h2>

              <h3>{this.state.user.paymentAddress}</h3>
              {util.checkPayment(this.state.user)}
            </div>
          : null}
      </div>
    );
  }
}

export default App;

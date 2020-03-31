import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as AWS from "aws-sdk";
const keyID = "AKIAUNQAIZXDRSPKXDFJ";
const keyPass = "01a9QRt20YrixEz1pRzqdnoGN8Od1AGHIChB5SR4";
AWS.config.update({
  region: "us-west-2",
  endpoint: "dynamodb.us-west-2.amazonaws.com",
  accessKeyId: keyID,
  secretAccessKey: keyPass
});

// function Clock(props) {
//   return (
//     <div>
//       <h1>Hello, world!</h1>
//       <h2>It is {props.date.toLocaleTimeString()}.</h2>
//     </div>
//   );
// }

class App extends Component {
  dynamodb = new AWS.DynamoDB();
  docClient = new AWS.DynamoDB.DocumentClient();
  constructor(props) {
    super(props);
    this.state = {
      numberOfDevicesDetected: null
    };
  }
  onRead = () => {
    let params = {
      TableName: "kkm_002TableA"
    };

    this.docClient.scan(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(data.Items[0].Data.obj);
        var countedIds = [];
        var numberOfDevicesDetected = 0;
        data.Items[0].Data.obj.forEach(async element => {
          if (element["minorID"] != null) {
            var found = false;
            await countedIds.map(id => {
              if (id === element["minorID"]) found = true;
            });
            if (!found) {
              numberOfDevicesDetected++;
              countedIds.push(element["minorID"]);
            }
            this.setState({ numberOfDevicesDetected });
          }
        });
      }
    });
  };

  componentDidMount() {
    this.onRead();
  }
  render() {
    const { numberOfDevicesDetected } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <h3>Number of Devices Detected: {numberOfDevicesDetected}</h3>
          </div>
        </header>
      </div>
    );
  }
}

export default App;

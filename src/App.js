import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as AWS from "aws-sdk";
const keyID = 
const keyPass = 
AWS.config.update({
  region: "us-west-2",
  endpoint: "dynamodb.us-west-2.amazonaws.com",
  accessKeyId: keyID,
  secretAccessKey: keyPass
});
class App extends Component {
  dynamodb = new AWS.DynamoDB();
  docClient = new AWS.DynamoDB.DocumentClient();
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      numberOfDevicesDetected: null,
      startDate: new Date(),
      toDate: new Date(),
      minDate: new Date(),
      maxDate: new Date()
    };
  }
  handleChangeStartDate = date => {
    date.setHours(23, 59, 59, 999);
    const { toDate, data } = this.state;
    this.setState({
      startDate: date
    });
    this.updateCount(date, toDate, data);
  };
  handleChangeToDate = date => {
    date.setHours(23, 59, 59, 999);
    const { startDate, data } = this.state;
    this.setState({
      toDate: date
    });
    this.updateCount(startDate, date, data);
  };
  updateCount = (startDate, toDate, data) => {
    var numberOfDevicesDetected = 0;
    data.map(element => {
      if (
        new Date(Number(element.timestamp)) >= startDate &&
        new Date(Number(element.timestamp)) <= toDate
      ) {
        var countedIds = [];
        if (element.Data.obj) {
          element.Data.obj.map(async element => {
            if (
              element["minorID"] != null &&
              Number(element["minorID"]) > 1000 &&
              Number(element["minorID"]) < 1010
            ) {
              var found = false;
              await countedIds.map(id => {
                if (id === element["minorID"]) found = true;
              });
              if (!found) {
                numberOfDevicesDetected++;
                countedIds.push(element["minorID"]);
                this.setState({ numberOfDevicesDetected });
              }
            }
          });
        }
      }
    });
  };
  onRead = () => {
    let params = {
      TableName: "kkm_002TableA"
    };
    this.docClient.scan(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        var minDate = null;
        var maxDate = null;
        minDate = new Date(Number(data.Items[0].timestamp));
        maxDate = new Date(Number(data.Items[data.Items.length - 1].timestamp));
        this.setState({
          minDate,
          maxDate,
          startDate: minDate,
          toDate: maxDate,
          data: data.Items
        });
        this.updateCount(minDate, maxDate, data.Items);
      }
    });
  };
  componentDidMount() {
    this.onRead();
  }
  render() {
    const {
      numberOfDevicesDetected,
      startDate,
      toDate,
      minDate,
      maxDate
    } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="DatePickerContainer">
            <h3> From </h3>
            <DatePicker
              selected={startDate}
              onChange={this.handleChangeStartDate}
              minDate={minDate}
              maxDate={maxDate}
            />
            <h3> To </h3>
            <DatePicker
              selected={toDate}
              onChange={this.handleChangeToDate}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
          <div>
            <h3>Number of Devices Detected: {numberOfDevicesDetected}</h3>
          </div>
        </header>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import logo from "../../../../logo.svg";
import "./Login.css";
class Login extends Component {
  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="LoginText">LOGIN</p>
      </div>
    );
  }
}
export default Login;

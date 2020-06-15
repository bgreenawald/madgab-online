import React, { Component } from "react";
import "../Styles/Variables.scss";

export default class Button extends Component {
  render() {
    return (
      <a href="" className={`${this.props.buttonRole} button`}>
        {this.props.text}
      </a>
    );
  }
}

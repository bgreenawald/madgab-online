import React, { Component } from "react";
import "../Styles/Variables.scss";
import "../Styles/Confetti.scss";

export default class ConfettiParticle extends Component {
  constructor(props) {
    super(props);
    this.colors = ["blue", "yellow", "purple", "pink"];
    this.color = "";
  }
  componentDidMount() {
    this.chooseRandomColor();
  }

  chooseRandomColor() {
    this.color =this.colors[Math.floor(Math.random()*4)];
    return this.color
  }
  render() {
    return <div className={`confetti-particle ${this.chooseRandomColor()} ${this.props.position}`} ></div>;
  }
}

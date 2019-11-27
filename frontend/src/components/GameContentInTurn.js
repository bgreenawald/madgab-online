import React, { Component } from "react";
import "../Styles/App.scss";

class GameContentInTurn extends Component {
  render() {
    return (
      <div className="game-content">
        <div id="timer" ref={this.timerDOM}></div>
        <div className="card">{this.props.current_madgab}</div>
        <div className="buttons">
          <button className="pass">Pass</button>
          <button className="correct">Correct</button>
        </div>
      </div>
    );
  }
}

export default GameContentInTurn;

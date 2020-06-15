import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Header.scss";

import { connect } from 'react-redux';

class Header extends Component {
  render() {
    return (
      <div className="header">
        <h3 className="round-counter">Round {this.props.state.round_number}</h3>
        <div className="score-box">
          <span className="team-1-blue-score">{this.props.state.team_1_score}</span>
          <span> - </span>
          <span className="team-2-red-score">{this.props.state.team_2_score}</span>
        </div>
        <div className="game-branding">
          <div className="footer-child">
            <p>Rad Gab</p>
          </div>
          <div className="footer-child">
            <p className="rules-button">Rules</p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: { ...state }
  }
}

export default connect(mapStateToProps)(Header);

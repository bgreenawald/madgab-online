import React, { Component } from "react";
import "../Styles/Header.scss";

import { connect } from 'react-redux';

class Header extends Component {
  render() {
      return (
        <div className="header">
          <h3 className="round-counter">Round {this.props.state.round_number ? this.props.state.round_number : 0}</h3>
          <div className="score-box">
            <span className="team-1-blue-score">{this.props.state.team_1_score ? this.props.state.team_1_score : 0}</span>
            <span> - </span>
            <span className="team-2-red-score">{this.props.state.team_2_score ? this.props.state.team_2_score : 0}</span>
          </div>
          <div className="game-branding">
            <div className="header-child">
              <a href='/' className='home-logo'>Rad Gab</a>
            </div>
            <div className="header-child">
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

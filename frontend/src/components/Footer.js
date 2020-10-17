import React, { Component } from "react";
import "../Styles/Footer.scss";
import { connect } from "react-redux";
import io from 'socket.io-client';
import { toggleUserRole } from '../store/actions';

class Footer extends Component {

  toggleRole = (role) => {
    this.props.toggleUserRole();
  };

  toggleDifficulty = e => {
    let socket = io(process.env.REACT_APP_BACKEND_URL);
    socket.emit("toggle_difficulty", {
      "name": this.props.state.id
    })
  };

  render() {
    return (
      <div className="footer">
        <div className="game-options">
          <div className="footer-child">
            <h3>Difficulty:</h3>
            <div className="binary-toggle">
              <span
                className={
                  this.props.state.difficulty === "easy"
                    ? "selected option"
                    : "option"
                }
                onClick={this.toggleDifficulty}
              >
                <p>Easy</p>
              </span>
              <span
                className={
                  this.props.state.difficulty === "hard"
                    ? "selected option"
                    : "option"
                }
                onClick={this.toggleDifficulty}
              >
                <p>Hard</p>
              </span>
            </div>
          </div>

          <div className="footer-child">
            <h3>Role</h3>
            <div className="binary-toggle">
              <span
                onClick={this.toggleRole}
                className={
                  this.props.state.userRole === "guesser"
                    ? "selected option"
                    : "option"
                }
              >
                <p>Guesser</p>
              </span>
              <span
                className={
                  this.props.state.userRole === "reader"
                    ? "selected option"
                    : "option"
                }
                onClick={this.toggleRole}
              >
                <p>Reader</p>
              </span>
            </div>
          </div>
        </div>

        <div className="game-branding">
          <div className="footer-child">
            <p>Rad Gab</p>
            {/* Insert Rad Gab logo here */}
          </div>

          <div className="footer-child">
            <span className="rules-button">Rules</span>
          </div>
        </div>
      </div >
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleUserRole: (role) => {
      dispatch(toggleUserRole())
    }
  }
}

const mapStateToProps = state => {
  return {
    state: { ...state }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

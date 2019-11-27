import React, { Component } from "react";
import "../Styles/Footer.scss";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      difficulty: "easy"
    };
  }

  toggleRole = e => {
    this.setState({ userRole: e.target.innerText.toLowerCase() });
  };

  toggleDifficulty = e => {
    this.setState({ difficulty: e.target.innerText.toLowerCase() });
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
                  this.state.difficulty === "easy"
                    ? "selected option"
                    : "option"
                }
                onClick={this.toggleDifficulty}
              >
                <p>Easy</p>
              </span>
              <span
                className={
                  this.state.difficulty === "hard"
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
                className={
                  this.state.userRole === "guesser"
                    ? "selected option"
                    : "option"
                }
                onClick={this.toggleRole}
              >
                <p>Guesser</p>
              </span>
              <span
                className={
                  this.state.userRole === "reader"
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
      </div>
    );
  }
}

export default Footer;

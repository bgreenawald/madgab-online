import React, { Component } from 'react';
import '../Styles/Footer.scss'

class Footer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        { this.state && console.log(this.state) }
        return (
            <div className="footer">
                <div className="game-options">

                    <div className="footer-child">
                        <h3>Difficulty:</h3>
                        <div className="binary-toggle">
                            <a className={this.props.difficulty === "easy" ? "selected option" : "option"}>
                                <p>Easy</p>
                            </a>
                            <a className={this.props.difficulty === "hard" ? "selected option" : "option"}>
                                <p>Hard</p>
                            </a>
                        </div>
                    </div>

                    <div className="footer-child">
                        <h3>Role</h3>
                        <div className="binary-toggle">
                            <a className={this.props.userRole === "guesser" ? "selected option" : "option"}>
                                <p>Guesser</p>
                            </a>
                            <a className={this.props.userRole === "reader" ? "selected option" : "option"}>
                                <p>Reader</p>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="game-branding">
                    <div className="footer-child">
                        <p>Rad Gab</p>
                        {/* Insert Rad Gab logo here */}
                    </div>

                    <div className="footer-child">
                        <a className="rules-button">Rules</a>
                    </div>

                </div>
            </div>
        )
    }
}

export default Footer
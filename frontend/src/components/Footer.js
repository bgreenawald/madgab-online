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
                <div className="game-info">
                    <div className="score">
                        <h3>Score:</h3>
                        <p>Team 1: <span>{this.props.team_1_score}</span></p>
                        <p>Team 2: <span>{this.props.team_2_score}</span></p>
                    </div>

                    <div className="difficulty">
                        <h3>Difficulty:</h3>
                        <p>{this.props.difficulty}</p>
                    </div>
                </div>

                <div className="game-branding">
                    <p>Rad Gab</p>
                    {/* Insert Rad Gab logo here */}
                </div>
            </div>
        )
    }
}

export default Footer
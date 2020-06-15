import React, { Component } from 'react';

class Menu extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="menu flex">
                <div className="user-bar flex">
                    <div className="user-team">
                    </div>

                    <div className="user-role">
                    </div>
                </div>
                <div className="menu-top">
                    <h3>Round 1</h3>
                    <div className="score-box">
                        <span className="current-team-score">0 -</span>
                        <span className="opposing-team-score"> 0</span>
                    </div>
                </div>
                <div className="menu-bottom flex">
                    <div className="game-info flex">
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

            </div>
        )
    }
}

export default Menu
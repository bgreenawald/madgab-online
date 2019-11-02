import React, { Component } from 'react';
import '../App.scss'


class GameContentTurnWait extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='game-content'>
                <div className="turn-container textbox">
                    <h3>It's your turn:</h3>
                    <h2>{this.props.active_team === 1 ? 'Blue' : 'Red'} Team</h2>
                </div>


                {/* <button id="start-turn primary" ref={this.startTurn} disabled={this.state.userRole === null} onClick={this.handleStartTurn}>Start turn!</button> */}

                <div className="game-options textbox">
                    <input type="checkbox" name="userRole" ref={this.props.userRole} onChange={this.handleRoleSelected} value="clue giver" />
                    <label htmlFor="Yes">I'm the clue reader</label>
                </div>
            </div>
    )
    }
}

export default GameContentTurnWait
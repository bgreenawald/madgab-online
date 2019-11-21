import React, { Component } from 'react';
import '../Styles/App.scss';
import '../Styles/Game.scss'

class GameContentTurnWait extends Component {
    constructor(props) {
        super(props)
    }

    startTurn = () => {
        console.log('starting the turn~~!')
    }

    render() {
        return (
            <div className='game-content'>
                <div className="turn-container textbox">
                    <h3>It's your turn:</h3>
                    <h2>{this.props.active_team === 1 ? 'Blue' : 'Red'} Team</h2>
                </div>


                <button 
                aria-label="start turn " 
                type="submit" 
                id="start-turn primary" 
                className="primary button"
                ref={this.startTurn} 
                disabled={this.props.userRole === null} 
                onClick={this.startTurn}>Start turn!</button>

                <div className="game-options textbox">
                    <input type="checkbox" name="userRole" ref={this.props.userRole} onChange={this.handleRoleSelected} value="clue giver" />
                    <label htmlFor="Yes">I'm the clue reader</label>
                </div>
            </div>
        )
    }
}

export default GameContentTurnWait
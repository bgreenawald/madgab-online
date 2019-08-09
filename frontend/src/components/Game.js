import React, {Component} from 'react';
import '../App.scss'
import Header from './Header'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //  href_parts = window.location.href.split("/"),
            active_team: 1,
             game_name: this.props.history.location,
             game_state: null,
             scores: [0,0],
             team: null,
             turn_timer: null,
             timer: null
        }
    }

    handleTeamSelection = e => {
        let selectedTeam = e.target.innerText
        let teamNumber = parseInt(selectedTeam.slice(selectedTeam.length-1, selectedTeam.length))
        this.setState({
            team: teamNumber,
            active_team: 1
        })
    }

    render() {
        console.log("GAME:", this.props.state)
        if (this.state.team) {
            console.log("You chose a team!")
            return(
                <div className="game-viewport">Hello world!</div>
            )
        }

        else {
            // choose your team
            return(
                <div className="game-viewport">

            <div className="choose-team container">
                <Header props={this.state.scores}/>
                <h1>Choose your team:</h1>
                <button onClick={this.handleTeamSelection} data="1">Team 1</button>
                <button onClick={this.handleTeamSelection} data="2">Team 2</button>
            </div>
            </div>

            )
        }
    }
}

export default Game
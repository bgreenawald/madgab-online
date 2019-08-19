import React, {Component} from 'react';
import '../App.scss'
import Header from './Header'
import socketIOClient from 'socket.io-client'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //  href_parts = window.location.href.split("/"),
            active_team: 1,
            game_id: this.props.history.location.state.game_id,
             game_name: this.props.history.location,
             game_state: null,
             response: null,
             userRole: null,
             scores: [0,0],
             team: null,
             turn_timer: null,
             timer: null
        }
        this.clueRadioYes = React.createRef();
        this.clueRadioNo = React.createRef();
        this.startTurn = React.createRef();
    }

    handleTeamSelection = e => {
        let selectedTeam = e.target.innerText
        let teamNumber = parseInt(selectedTeam.slice(selectedTeam.length-1, selectedTeam.length))
        this.setState({
            team: teamNumber,
            active_team: 1
        })
    }

    //  componentDidMount =  () => {
    // when exactly to use component did mount?????????? !<KMLFJEALJNFL
    
    // }

    joinGame = () => {
        var socket = socketIOClient('http://localhost:5000')
        socket.on("connect", () => {
            socket.emit("join", this.state.game_id);
        });
    }

     //     // Load the current state of the board, or create a new one
     loadBoard = () => {
         console.log("GAME ID", this.state.game_id)
         var socket = socketIOClient('http://localhost:5000')
         socket.on("connect", () => {
             socket.emit("load_board", {
                 "name": this.state.game_id
             })
         })
     }
         

    renderBoard = () => {
        var socket = socketIOClient('http://localhost:5000')
        socket.on("render_board", resp => {
            console.log("RESP", resp)
            let game_state = JSON.parse(resp.payload)
            console.log(game_state)
            this.setState({
                response: game_state
            })
        })
    }

    handleGameStart = () => {
        this.setState({
            turn_timer: 90
        })
    }

    handleRoleSelected = () => {
        // console.log("is yes checked?", this.clueRadioYes.current.value) 
        this.setState({
            userRole: document.querySelector('input[name="userRole"]:checked').value
        })
    }

    render() {
        console.log("STATE", this.state)
        this.joinGame()
        this.loadBoard()
        this.renderBoard()

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

                <div className="turn-container">
                    <h3>It's your turn next:</h3>
                    <h2>Team 1</h2>
                </div>

                {/* <div className="choose-team container">
                    <Header props={this.state.scores}/>
                    <h1>Choose your team:</h1>
                    <button onClick={this.handleTeamSelection} data="1">Team 1</button>
                    <button onClick={this.handleTeamSelection} data="2">Team 2</button>
                </div> */}

                <div className="game-options">
                    <p>Are you the clue giver?</p>
                    <input type="radio" name="userRole" ref={this.clueRadioYes} onChange={this.handleRoleSelected} value="clue giver"/>
                    <label htmlFor="Yes">Yes</label>
                    <input type="radio" name="userRole"  ref={this.clueRadioNo} onChange={this.handleRoleSelected} value="clue guesser"/>
                    <label htmlFor="No">No</label>
                </div>

                <button id="start-turn" ref={this.startTurn} disabled={this.state.userRole === null} onClick={this.renderBoard}>Start the turn!</button>
            </div>

            )
        }
    }
}

export default Game
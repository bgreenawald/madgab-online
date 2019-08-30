import React, { Component } from 'react';
import '../App.scss'
import Menu from './Menu'
import io from 'socket.io-client'

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //  href_parts = window.location.href.split("/"),
            active_team: 1,
            game_id: this.props.history.location.state.game_id,
            game_name: this.props.history.location,
            inTurn: false
        }
        this.socket = io('http://localhost:5000/')
        this.clueRadioYes = React.createRef();
        this.clueRadioNo = React.createRef();
        this.startTurn = React.createRef();
        this.timerDOM = React.createRef();
    }

    handleTeamSelection = e => {
        let selectedTeam = e.target.innerText
        let teamNumber = parseInt(selectedTeam.slice(selectedTeam.length - 1, selectedTeam.length))
        this.setState({
            team: teamNumber,
            active_team: 1
        })
    }

    // join socket, load board, and render board
    componentDidMount = () => {
        let socket = io('http://localhost:5000')
        let id = this.state.game_id
        socket.on('connect', () => {
            socket.emit("join", id)
            socket.emit("load_board", {
                "name": id
            })
            socket.on("render_board", resp => {
                let game_state = JSON.parse(resp.payload)
                console.log("RESP", game_state)
                this.setState({
                    ...game_state,
                    loaded: true
                })
            })
        })
    }

    // componentWillMount() {
    //     this.refs= {}
    // }

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

    start_timer = () =>  {
        let socket = io('http://localhost:5000')
        let id = this.state.game_id
        // let timer = this.state.seconds_per_turn

        var minutes = parseInt(this.state.seconds_per_turn / 60, 10);
        var seconds = parseInt(this.state.seconds_per_turn % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.timerDOM.current.innerText = minutes + ":" + seconds;

        if (--this.state.seconds_per_turn < 0) {
            socket.emit("end_turn", {
                "name": id,
                "correct": false,
                "time_left": 0
            })
        }
    }

    handleStartTurn = () => {
        let timer = this.state.seconds_per_turn
        let turn_timer = setInterval(this.start_timer, 1000)
        let socket = io('http://localhost:5000')
        let id = this.state.game_id
        socket.on('connect', resp => {
            socket.emit("start_turn", {
                "name": id
            })
            console.log("RESP after start turn", JSON.parse(resp))
        })
        this.setState({
            inTurn: true
        })
    }

    // renderBoard = () => {
    //     this.setState({
    //         inTurn: true
    //     })
    // }

    render() {
        //    console.log("STATE", this.state)

        if (this.state.inTurn) {
            console.log("STATEEEE", this.state)
            return (
                <div className="game-viewport">
                    <Menu props={this.state} />

                    <div className="gameplay-container">
                        <div id="timer" ref={this.timerDOM}></div>
                        <div className="card">
                            {/* {this.state.} */}
                        </div>
                        <div className="buttons">
                            <button className="pass">Pass</button>
                            <button className="correct">Correct</button>
                        </div>
                    </div>

                </div>
            )
        }
        else if (this.state.loaded) {
            // choose your team
            console.log("Game.js state", this.state)
            return (
                <div className="game-viewport">
                    <Menu {...this.state} />

                    <div className="turn-container">
                        <h3>You're up:</h3>
                        <h2>Team {this.state.active_team}</h2>
                    </div>


                    {/* <div className="choose-team container">
                    <Menu props={this.state.scores}/>
                    <h1>Choose your team:</h1>
                    <button onClick={this.handleTeamSelection} data="1">Team 1</button>
                    <button onClick={this.handleTeamSelection} data="2">Team 2</button>
                </div> */}

                    <div className="game-options">
                        <p>Are you the clue giver?</p>
                        <input type="radio" name="userRole" ref={this.clueRadioYes} onChange={this.handleRoleSelected} value="clue giver" />
                        <label htmlFor="Yes">Yes</label>
                        <input type="radio" name="userRole" ref={this.clueRadioNo} onChange={this.handleRoleSelected} value="clue guesser" />
                        <label htmlFor="No">No</label>
                    </div>

                    <button id="start-turn" ref={this.startTurn} disabled={this.state.userRole === null} onClick={this.handleStartTurn}>Start the turn!</button>
                </div>

            )
        }

        else {
            // console.log("You chose a team!")
            return (
                <div className="game-viewport">
                    <Menu {...this.state} />

                </div>
            )
        }

    }
}

export default Game
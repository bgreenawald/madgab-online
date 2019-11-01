import React, { Component } from 'react';
import '../App.scss'
import '../game.scss'
import Menu from './Menu'
import Header from './Header'
import Footer from './Footer'
import io from 'socket.io-client'
import $ from 'jquery';


class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //  href_parts = window.location.href.split("/"),
            active_team: 1,
            game_id: this.props.history.location.state.game_id,
            game_name: this.props.history.location,
            inTurn: false,
            userTeam: 1
        }
        this.socket = io('http://localhost:5000/')
        this.clueRadioYes = React.createRef();
        this.clueRadioNo = React.createRef();
        this.startTurn = React.createRef();
        this.timerDOM = React.createRef();
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
                console.log("RESP from render board", game_state)
                this.setState({
                    ...game_state,
                    loaded: true
                })
            })
        })
    }

    handleGameStart = () => {
        this.setState({
            turn_timer: 90
        })
    }

    handleRoleSelected = () => {
        this.setState({
            userRole: document.querySelector('input[name="userRole"]:checked').value
        })
    }

    handleTeamSelection = e => {
        let chosenTeam = Number(document.querySelector('input[name="teamChoice"]:checked').value)
        let bgColor = (chosenTeam === 1 ? "team1 game-viewport" : "team2 game-viewport")

        this.setState({
            userTeam: chosenTeam,
            bgcolor: bgColor
        })
    }


    start_timer = () => {
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
        })
        this.setState({
            inTurn: true
        })
    }

    render() {

        if (this.state.inTurn) {
            return (
                <div className={this.state.bgcolor, "gameport-view"}>
                    {/* <Menu {...this.state} /> */}

                    <div className="gameplay-container">
                        <div id="timer" ref={this.timerDOM}></div>
                        <div className="card">
                            {this.state.current_madgab}
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
            if (this.state.inTurn) {
                return (
                    <React.Fragment>
                    <Header {...this.state} />
                    <div className="game-viewport">


                        <div className="turn-container textbox">
                            <h3>It's your turn:</h3>
                            <h2>{this.state.active_team === 1 ? 'Blue' : 'Red'} Team</h2>
                        </div>


                        <button id="start-turn" ref={this.startTurn} disabled={this.state.userRole === null} onClick={this.handleStartTurn}>Start turn!</button>

                        <div className="game-options textbox">
                            <input type="checkbox" name="userRole" ref={this.userRole} onChange={this.handleRoleSelected} value="clue giver" />
                            <label htmlFor="Yes">I'm the clue reader</label>
                        </div>
                        <Footer {...this.state} />
                    </div>

                </React.Fragment>
                )
            }

            else {
                return (
                    <React.Fragment>
                    <div className="game-viewport" id="css3-background-texture">


                        <div className="turn-container textbox">
                            <h3>It's your turn:</h3>
                            <h2>{this.state.active_team === 1 ? 'Blue' : 'Red'} Team</h2>
                        </div>


                        <button id="start-turn" ref={this.startTurn} disabled={this.state.userRole === null} onClick={this.handleStartTurn}>Start turn!</button>

                        <div className="game-options textbox">
                            <input type="checkbox" name="userRole" ref={this.userRole} onChange={this.handleRoleSelected} value="clue giver" />
                            <label htmlFor="Yes">I'm the clue reader</label>
                        </div>
                    </div>

                </React.Fragment>
                )
            }
        }

        else {
            return (
                <div className="game-viewport">
                    <Menu {...this.state} />
                </div>
            )
        }

    }
}

export default Game
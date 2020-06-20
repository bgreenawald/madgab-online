
import React, { Component } from "react";
import { connect } from 'react-redux';

import Countdown from './Countdown';
// import ClueIcon from './ClueIcon';
import { updateGameData } from '../store/actions';

import io from 'socket.io-client';

let socket = io('http://localhost:5000')

class Stealing extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.availablePoints = 0;
        this.stealTimerLength = 10;
        this.stealTimer = this.stealTimerLength;
    }

    componentDidMount = () => {
        this.calculateAvailablePoints();
    }

    calculateAvailablePoints = () => {
        this.props.updateGameData({
            availablePoints: Number(this.props.state.words_per_turn) - Number(this.props.state.current_turn_correct)
        })
    }

    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 3
        });

        // launch countdown component
    }

    beginCountdown = () => {
        this.stealTimerID = setInterval(this.decrease, 1000);

        this.props.updateGameData({
            inCountdown: true
        })
    }

    decrease = () => {
        if (this.stealTimer === 0) setTimeout(this.stopCountdown)
        else {
            this.setState({
                stealTimer: this.stealTimer--
            })
        }
        console.log(this.stealTimer)
    }

    stopCountdown = () => {
        clearInterval(this.stealTimerID);

        this.props.updateGameData({
            inCountdown: false
        })
    }

    resetTimer = () => {
        this.stealTimer = this.stealTimerLength;
    }

    render() {
        if (this.props.state.inCountdown === true) {
            return (
                <div className="game-content">
                    {this.stealTimer}
                </div>
            )
        }
        else {

            return (

                <div className="game-content">
                    <h2>{this.props.state.opposingTeam} team, you get 10 seconds to steal {this.props.state.availablePoints} points from the {this.props.state.currentTeam} team!</h2>
                    <button className="primary" onClick={this.beginCountdown}>Let's steal!</button>
                    <div className="tooltip-icon">?
                        <div className="tooltip modal"><span>these are the rules</span></div>
                    </div>
                </div>

            )
        }
    }
}

const mapStateToProps = state => {
    return {
        state: { ...state }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGameData: gameData => {
            dispatch(updateGameData(gameData))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stealing);
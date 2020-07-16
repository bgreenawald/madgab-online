
import React, { Component } from "react";
import { connect } from 'react-redux';

import {ClueIcon, ClueIconButton} from './ClueIcon';
import { updateGameData } from '../store/actions';

import io from 'socket.io-client';

import "../Styles/Stealing.scss";

let socket = io('http://localhost:5000')

class Stealing extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.stolenPoints = 0;
        this.stealTimerLength = 10;
        this.stealTimer = this.stealTimerLength;
    }

    submitSteal = () => {
        // TODO: get steal value from user!
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": this.stolenPoints
        });
    }

    beginCountdown = () => {
        this.stealTimerID = setInterval(this.decrease, 1000);

        this.props.updateGameData({
            inCountdown: true
        })
    }

    decrease = () => {
        if (this.stealTimer === 1) {
            setTimeout(this.stopCountdown);
            this.stealTimerLength = 10;
            // this.submitSteal()
        }
        else {
            this.setState({
                stealTimer: this.stealTimer--
            })
        }
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
            console.log(this.props.state.current_turn_clues)
            return (
                <div className="game-content">
                    <h1>The stealer recalled</h1>
                    <div className="clue-icon-container">
                        {this.props.state.current_turn_clues.map((e, i) => (
                          <ClueIconButton value={i} key={i}/>
                        ))}
                    </div>
                    <h1>Clues</h1>
                    <div className="cta-steal-submit">
                        <button className="steal-submit-button" onClick={this.submitSteal}>Submit</button>
                        <span className="steal-submit-timer">{this.stealTimer}s</span>
                    </div>
                </div>
            )
        }
        else if (this.props.state.availablePoints >= 0) {

            return (
                <div className="game-content">
                    <h1>{this.props.state.availablePoints} points</h1>
                    <h3>are available for the</h3>
                    <h1>{this.props.state.currentTeam} team!</h1>
                    <h2>to steal</h2>
                    <div className="cta-begin-stealing">
                        <button className="primary" onClick={this.beginCountdown}>Let's steal!</button>
                        <div className="tooltip-icon tooltip">?
                            <div className="tooltip-modal">
                                <span>these are the rules</span>
                                <span className="arrow-down"></span>
                            </div>
                        </div>
                    </div>
                </div>

            )
        }

        else {
            return (
                <div className="game-content">
                    <div className="loading-container">
                        <div className="loader"></div>
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
import React, { Component } from 'react';
import '../Styles/App.scss';
import "../Styles/Game.scss";

import { connect } from 'react-redux';
import { updateGameData } from '../store/actions';

class Countdown extends Component {

    beginCountdown = () => {
        return setInterval(this.decrease, 1000)
    }

    countdownArray = ['Ready?', 3, 2, 1, 'end'];

    decrease = () => {
        this.props.updateGameData({
            countdownTimer: this.currentValue
        })
        if (this.countdownArray.length === 0) {
            this.clearCountdown(this.countdownTimerID)
            this.props.updateGameData({
                inCountdown: false
            })
        }
        else { this.currentValue = this.countdownArray.shift(); }
    }

    resetCountdown = () => {
        this.currentValue = this.countdownArray.shift();

        this.props.updateGameData({
            countdownTimer: this.currentValue
        })

        this.currentValue = this.countdownArray.shift();

    }

    clearCountdown = () => {
        clearInterval(this.countdownTimerID)
    }

    initializeCountdown = () => {
        this.resetCountdown();
        this.countdownTimerID = this.beginCountdown();
    }

    componentDidMount = () => {
        this.initializeCountdown();
    }

    render() {
        return (
            <div className="game-content">
                <div id="countdown">
                    {this.props.state.countdownTimer}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        state: { ...state }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGameData: (gameData) => {
            dispatch(updateGameData(gameData))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Countdown);
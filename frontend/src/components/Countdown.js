import React, { Component } from 'react';
import '../Styles/App.scss';
import { connect } from 'react-redux';
import { updateGameData } from '../store/actions';

class Countdown extends Component {

    beginCountdown = () => {
        return setInterval(this.decrease, 1000)
        // setTimeout(clearInterval(timerID), 3000)
    }

    countdownArray = [];

    decrease = () => {
        console.log('counting down')
        let currentCountdownValue = this.props.state.countdownTimer;
        let newValue = --currentCountdownValue;
        if (currentCountdownValue === 0) {
            this.clearCountdown(this.countdownTimerID)
        }
        else {
            this.props.updateGameData({
                countdownTimer: newValue
            })
        }
    }

    resetCountdown = () => {
        this.props.updateGameData({
            countdownTimer: 3
        })
    }

    clearCountdown = () => {
        clearInterval(this.countdownTimerID)
        // this.resetCountdown()
    }

    initializeCountdown = () => {
        this.resetCountdown();
        this.countdownTimerID = this.beginCountdown();
    }

    componentDidMount = () => {
        // this.resetCountdown();
        // this.countdownTimerID = this.beginCountdown()
        // setTimeout(clearInterval(this.countdownTimerID), 3000)
        this.initializeCountdown();
    }

    render() {
        return (
            <div id="game-content">
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
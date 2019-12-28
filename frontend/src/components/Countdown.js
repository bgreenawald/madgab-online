import React, { Component } from 'react';
import '../Styles/App.scss';
import "../Styles/Game.scss";

import { connect } from 'react-redux';
import { updateGameData } from '../store/actions';

class Countdown extends Component {
    constructor(props) {
        super(props)
        this.countdownArray = this.props.inheritedCountdown || ['Ready?', 3, 2, 1, 'end'];
    }
    beginCountdown = () => {
        return setInterval(this.decrease, 1000)
    }

    // countdownArray = ['Ready?', 3, 2, 1, 'end'];

    decrease = () => {
        // this.currentValue = this.countdownArray.shift();
        this.props.updateGameData({
            countdownDisplay: this.currentValue
        })
        if (this.countdownArray.length === 0) {
            setTimeout(this.stopCountdown, 1000)
        }
        else { this.currentValue = this.countdownArray.shift(); }
    }

    stopCountdown = () => {
        this.clearCountdown(this.countdownTimerID)
        this.props.updateGameData({
            inCountdown: false
        })
    }

    // resetCountdown = () => {
    //     this.currentValue = this.countdownArray.shift();
    //     this.props.updateGameData({
    //         countdownDisplay: this.currentValue
    //     })

    //     this.currentValue = this.countdownArray.shift();

    // }

    resetCountdown = () => {
        this.currentValue = this.countdownArray[0]
    }

    clearCountdown = () => {
        clearInterval(this.countdownTimerID)
    }

    parseCountdown = () => {
        if (this.props.inheritedCountdown)
            for (let i = 0; i < this.props.inheritedCountdown.length; i++) {
                let elem = this.props.inheritedCountdown[i];
                if (typeof (elem) === 'string' && elem.includes('...')) {
                    elem = elem.replace('...', '')
                    elem = Number(elem);
                    for (let j = elem; j > 0; --j) {
                        this.props.inheritedCountdown[i] = j;
                        i++;
                    }
                }
            }
    }

    initializeCountdown = () => {
        this.parseCountdown();
        // this.resetCountdown();
        this.countdownTimerID = this.beginCountdown();
    }

    componentDidMount = () => {
        this.initializeCountdown();
    }

    render() {
        return (
            <div className="game-content">
                <div id="countdown">
                    {this.props.state.countdownDisplay}
                    {this.props.stealingSequence}
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
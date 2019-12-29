import React, { Component } from 'react';
import '../Styles/App.scss';
import "../Styles/Game.scss";

import { connect } from 'react-redux';
import { updateGameData } from '../store/actions';

class Countdown extends Component {
    constructor(props) {
        super(props)
    }

    beginCountdown = () => {
        this.countdownArray = this.props.inheritedCountdown || ['Ready?', 3, 2, 1];
        this.currentValue = this.countdownArray[0]
        return setInterval(this.decrease, 1000)
    }


    decrease = () => {

        this.currentValue = this.countdownArray.shift();
        console.log('decreasing', this.countdownArray, 'length:', this.countdownArray.length, 'curVal', this.currentValue)

        if (this.countdownArray.length === 0) {
            setTimeout(this.stopCountdown, 1000)
        }

    }

    stopCountdown = () => {
        this.clearCountdown(this.countdownTimerID)
        this.props.updateGameData({
            inCountdown: false
        })
    }

    setInitialValue = () => {
        this.countdownArray = this.props.inheritedCountdown || ['Ready?', 3, 2, 1];
        this.currentValue = this.countdownArray[0]
    }

    clearCountdown = () => {
        clearInterval(this.countdownTimerID)
    }

    parseCountdown = () => {
        if (this.props.inheritedCountdown) {
            for (let i = 0; i < this.props.inheritedCountdown.length; i++) {
                let elem = this.props.inheritedCountdown[i];
                if (typeof (elem) === 'string' && elem.includes('...')) {
                    let restOfCountdown = this.props.inheritedCountdown.splice(i, this.props.inheritedCountdown.length - 1)
                    elem = elem.replace('...', '')
                    elem = Number(elem);
                    for (let j = elem; j > 0; --j) {
                        this.props.inheritedCountdown.splice(i, 0, j);
                        i++;
                    }
                }
            }
        }
    }

    removeTrailingDots = () => {
        // if (this.props.inheritedCountdown) {
        //   this.countdownArray.map ( e => {
        // if (elem.includes('...')) return Number(elem.replace('...', ''))
        // else return elem
        // }) }
    }


    initializeCountdown = () => {
        // this.setInitialValue();
        // this.parseCountdown();
        this.countdownTimerID = this.beginCountdown();
    }

    componentDidMount = () => {
        this.initializeCountdown();
    }

    render() {
        return (
            <div className="game-content">
                <div id="countdown">
                    {/* {this.props.state.countdownDisplay ? this.props.state.countdownDisplay : this.countdownArray[0]} */}
                    {this.currentValue}
                    {/* {this.props.state.countdownDisplay}
                    {this.props.stealingSequence} */}
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
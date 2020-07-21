import React, { Component } from 'react';
import "../Styles/Loading.scss";

import { connect } from 'react-redux';
import { updateGameData } from '../store/actions';

class Countdown extends Component {
    constructor(props) {
        super(props)
        this.countdownLength = this.props.inheritedCountdown + 1 || 3 + 1;
        this.timer = 0;
    }

    beginCountdown = () => {
        this.countdownTimerID = setInterval(this.decrease, 1000)
    }


    decrease = () => {
        if (this.timer === 1) {
            setTimeout(this.stopCountdown)
        }
        else {
            this.setState({
                timer: this.timer--
            })
        }
    }

    stopCountdown = () => {
        clearInterval(this.countdownTimerID)

        this.props.updateGameData({
            inCountdown: false
        })
    }


    componentDidMount = () => {
        this.timer = this.countdownLength;
        this.beginCountdown();
    }

    render() {
        return (
            <div className="game-content">
                <div id="countdown">
                    {this.timer ? <h1>
                        {this.timer}
                    </h1> :
                        <div className="loading-container">
                            <h2>{this.props.loadingMessage || null}</h2>
                            <div className="loader"></div>
                        </div>
                    }
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
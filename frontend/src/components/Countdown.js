import React, { Component } from 'react';
import '../Styles/App.scss';
import "../Styles/Game.scss";
import "../Styles/Loading.scss";

import { connect } from 'react-redux';
import { updateGameData } from '../store/actions';

class Countdown extends Component {
    constructor(props) {
        super(props)
        this.countdownArray = this.props.inheritedCountdown || [3, 2, 1];
        this.index = 0;
    }

    beginCountdown = () => {
        return setInterval(this.decrease, 1000)
    }


    decrease = () => {
        if (this.countdownArray.length === 0) {
            setTimeout(this.stopCountdown, 1000)
        }
        this.index = this.index + 1;
        this.currentValue = this.countdownArray[this.index];
        if (this.index === this.countdownArray.length) {
            setTimeout(this.stopCountdown, 1000);
        }
    }

    stopCountdown = () => {
        clearInterval(this.countdownTimerID)

        this.props.updateGameData({
            inCountdown: false
        })
    }


    componentDidMount = () => {
        this.currentValue = this.countdownArray[this.index];
        // this.index = this.index + 1;
        this.countdownTimerID = this.beginCountdown();
    }

    render() {
        return (
            <div className="game-content">
                <div id="countdown">
                    {this.currentValue ? <h1>
                        {this.currentValue}
                    </h1> :
                        <div className="loading-container">
                            <h2>{this.props.loadingMessage || null}</h2>
                            <div className="loader"></div>
                        </div>
                        // this.countdownArray[this.index]
                        // "loading"
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
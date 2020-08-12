import "../Styles/Stealing.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import { updateGameData } from '../store/actions';

import ClueIcon from './ClueIcon';

import {gsap} from 'gsap';

import io from 'socket.io-client';
let socket = io('http://localhost:5000');


class Stealing extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.stolenPoints = 0;
        this.stealTimerLength = 10;
        this.stealTimer = this.stealTimerLength;
        this.animation = gsap.timeline();
    }

    componentDidMount() {
        // gsap.timeline().from('h1', {duration: 1, opacity: 0.5})
        this.animation.from('h1#available-points', {
            duration: 1,
            opacity: 0,
            y: -50,
            ease: "power3(1, 0.3)"
        })
        .from('.line', {
            duration: 1,
            opacity: 0,
            x: 30,
            ease: "power3(1, 0.3)"
        }, .5)
        .from('.cta-begin-stealing', {
            duration: 1,
            opacity: 0,
            x: 50,
            ease: "power3(1, 0.3)"
        }, 1)
        .from('.tooltip', {
            duration: .4,
            opacity: 0,
            scale: .7,
            ease: "back"
        })
    }

    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 30
        });
    }

    beginCountdown = () => {
        // this.stealTimerID = setInterval(this.decrease, 1000);

        this.props.updateGameData({
            inCountdown: true
        })
    }

    decrease = () => {
        if (this.stealTimer === 1) {
            setTimeout(this.stopCountdown);
            this.stealTimerLength = 10;
        }
        else {
            this.setState({
                stealTimer: this.stealTimer--
            })
        }
    }

    stopCountdown = () => {
        clearInterval(this.stealTimerID);

        this.submitSteal();

        this.props.updateGameData({
            inCountdown: false
        })
    }

    calculateStealablePoints = () => {
        this.stealablePointsArray = [];
        for (let i = 0; i <= this.props.state.availablePoints; i++) {
            this.stealablePointsArray.push(i)
        }
    }

    resetTimer = () => {
        this.stealTimer = this.stealTimerLength;
    }

    render() {

        if (this.props.state.inCountdown === true) {
            console.log(this.props.state.current_turn_clues)
            this.calculateStealablePoints();
            return (
                <div className="game-content">
                    <h1>How many clues did the stealer recall?</h1>
                    <div className="clue-icon-container">
                        {this.stealablePointsArray.map((e, i) => (
                                <ClueIcon value={i} key={i} isButton={true} />
                        ))}
                    </div>
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
                    <h1 id="available-points">{this.props.state.availablePoints} points</h1>
                    <h3 className="line two">are available for the</h3>
                    <h1 className="line three">{this.props.state.currentTeam} team</h1>
                    <h2 className="line four">to steal</h2>
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
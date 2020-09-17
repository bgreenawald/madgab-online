import "../Styles/Stealing.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import { updateGameData } from '../store/actions';

import ClueIcon from './ClueIcon';

import { gsap } from 'gsap';

import Socket from './Socket';
let socket = Socket;


class Stealing extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.stolenPoints = 0;
        this.stealTimerLength = 10;
        this.stealTimer = this.stealTimerLength;
        this.animation = gsap.timeline({ defaults: { duration: 1, opacity: 0 } }).paused(true);
    }

    componentDidMount() {
        this.showScore();
        this.animation
            .from('#available-points', {
                duration: 1,
                opacity: 0,
                y: 50,
                ease: 'back'
            })
            .from('.line.three', {
                duration: 1,
                opacity: 0,
                y: 50,
                ease: 'back'
            }, '-=.5')
            .from('.line.two', {
                duration: 1,
                opacity: 0,
                y: 50,
                ease: 'back'
            }, '-=1')
            .to('.circle-icon.correct', {
                opacity: 0,
                y: 50,
                ease: 'power3'
            }).play();
    }

    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 30
        });
    }

    beginCountdown = () => {
        this.stealTimerID = setInterval(this.decrease, 1000);

        this.props.updateGameData({
            inCountdown: true
        })
        this.hideScore();
    }

    animateCountdown() {
        // do animation;
        console.log('animating')
    }

    componentDidUpdate() {
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

    hideScore() {
        this.props.updateGameData({
            scoreVisible: false
        })
    }

    showScore()  {
        this.props.updateGameData({
            scoreVisible: true
        })
    }

    render() {
        if (this.props.state.inCountdown === true) {
            this.calculateStealablePoints();
            this.animateCountdown();
            return (
                <div className="game-content">
                    <h1 id="title-how-many">How many clues did the stealer recall?</h1>
                    <div className="clue-icon-container" ref={div => this.myElement = div}>
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
                    <h1 className="line three">{this.props.state.opposingTeam} team</h1>
                    <h3 className="line two">here's your chance to steal</h3>
                    <div className="icon-placeholder"></div>
                    <h1 id="available-points">{this.props.state.availablePoints} points</h1>
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
            const copyGameData = JSON.parse(JSON.stringify(gameData));
            dispatch(updateGameData(copyGameData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stealing);
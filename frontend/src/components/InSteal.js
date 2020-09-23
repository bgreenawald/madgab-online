import "../Styles/Stealing.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import { updateGameData } from '../store/actions';

import ClueIcon from './ClueIcon';

import { gsap } from 'gsap';

import Socket from './Socket';
let socket = Socket;


class InSteal extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.stolenPoints = 0;
        this.stealTimerLength = 10;
        this.stealTimer = this.stealTimerLength;
        this.countdownAnimation = gsap.timeline({defaults: {duration: 1, opacity: 0, ease: 'power3'}}).timeScale(2).paused(true);
    }

    componentDidMount() {
        this.animateCountdown();
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
    }

    animateCountdown() {
        document.querySelector('.clue-icon-container').classList.add('none');

        this.countdownAnimation
        .from('.game-content .clue-icon-container .circle-icon', {
            y: 10,
            x: 30,
            opacity: 0,
            stagger: 0.2
        })
        .from('h1#title-how-many', {
            y: 10,
            x: 30,
        }, "-=0.5")
        .from(".steal-submit-button", {
            y: 10,
            x: 30,
        }, "-=0.5")
        .from(".steal-submit-timer", {
            y: 10,
            ease: 'back',
            scale: 0,
            onComplete: this.beginCountdown

        })
        .resume();
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
            this.calculateStealablePoints();
            return (
                <div className="game-content">
                    <h1 id="title-how-many">How many clues did the stealer recall?</h1>
                    <div className="clue-icon-container" ref={div => this.myElement = div}>
                        {this.stealablePointsArray.map((e, i) => (
                            <ClueIcon value={i} key={i} isButton={true} />
                        ))}
                    </div>
                    <div className="cta-steal-submit">
                        <button className="primary steal-submit-button" onClick={this.submitSteal}>Submit</button>
                        <span className="steal-submit-timer">{this.stealTimer}s</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(InSteal);
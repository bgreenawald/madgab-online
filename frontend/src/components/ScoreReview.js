import "../Styles/Game.scss";
import "../Styles/Review.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import ClueIcon from './ClueIcon';
import { updateGameData } from '../store/actions';

import io from 'socket.io-client';

import { gsap } from 'gsap';

let socket = io('http://localhost:5000')

class ScoreReview extends Component {

    constructor(props) {
        super(props);
        this.cluesIcons = [];
        this.animation = gsap.timeline();
    }

    componentDidMount() {
        this.animation
            .from(
                '.circle-icon:not(.total)', {
                duration: 1,
                opacity: 0,
                y: -30,
                ease: 'power1',
                stagger: 0.2
            })
            .to(
                '.circle-icon.incorrect', {
                duration: 1,
                opacity: 0,
                y: 25,
                ease: 'power3(1,0.3)',
            }, '-=0.2')
            // .to(
            //     '.circle-icon.correct', {
            //     duration: 2,
            //     y: 50,
            //     ease: 'power3(1,0.3)'
            // }, '-=1.2')
            .to('.circle-icon:nth-child(1)', {
                duration: 1,
                x: 70,
                y: 25,
                ease: 'power1.in'
            }, '-=0.2')
            .to('.circle-icon:nth-child(3)', {
                duration: 1,
                x: -70,
                y: 25,
                ease: 'power1.in'
            }, '-=1')
            // .from('.circle-icon.total', {
            //     opacity: 0,
            //     scale: 0,
            //     ease: 'back'
            // }, '-=0.3')
            .to('.circle-icon:not(.total)', {
                duration: .7,
                opacity: 0,
                ease: "back"
            }, '-=1')
            .from(
                'h1#points-count', {
                duration: 1,
                y: 30,
                ease: 'power3',
                opacity: 0,
                // onComplete: this.test
            }, '-=.7')
            .from(
                'button.primary', {
                duration: 1,
                y: 30,
                ease: 'power3',
                opacity: 0,
                // onComplete: this.test
            }, '-=.3')
    }

    test() {
        // console.log('finished');
        // const correctIcons = Array.from(document.querySelectorAll('.circle-icon.correct'));
        // correctIcons.forEach(icon => {
        //     icon.classList.add('converge');
        // })
        const total = document.querySelector('.circle-icon.total');
        total.classList.remove('hidden');
        total.classList.add('show');

        const clueIconContainer = document.querySelector('.clue-icon-container');
        clueIconContainer.classList.add('none');
    }

    getPoints = (pts) => {
        switch (pts) {
            case 1:
                return `1 point!`;
            default:
                return `${pts} points!`
        }
    }

    stealInit = () => {
        socket.emit("end_turn", {
            "name": this.props.state.id
        })
    }

    render() {
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        let totalPoints = this.getPoints(this.props.state.current_turn_correct);

        return (
            <div className="game-content">
                <h2>{currentTeam},  you scored: </h2>
                <div className="clue-icon-container">
                    {this.props.state.current_turn_clues.map((e, i) => (
                        <ClueIcon
                            value={e[2] ? 'correct' : 'incorrect'}
                            key={i}
                            isButton={false} />
                    ))}
                    <div className="circle-icon total hidden">4</div>
                </div>
                {/* <div className="square" ref={elem => this.myElement = elem}></div> */}
                <h1 id='points-count'>{totalPoints}</h1>
                <button className="primary" onClick={this.stealInit}>continue</button>
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
        updateGameData: gameData => {
            dispatch(updateGameData(gameData))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreReview);
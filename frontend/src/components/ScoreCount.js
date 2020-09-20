import "../Styles/Game.scss";
import "../Styles/Review.scss";

import React, { Component } from "react";
import { connect } from 'react-redux';

import ClueIcon from './ClueIcon';
import { updateGameData } from '../store/actions';

import Socket from './Socket';

import { gsap } from 'gsap';

let socket = Socket;

class ScoreCount extends Component {

    constructor(props) {
        super(props);
        this.cluesIcons = [];
        this.animation = gsap.timeline();
        this.fadeAnimation = gsap.timeline().paused(true);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.realign();
    }

    componentDidUpdate() {
       this.realign();
    }

    realign() {
        let iconsHeight = document.querySelector('.icon-placeholder');
        if (!iconsHeight) {
            return;
        } 
        iconsHeight = iconsHeight.getClientRects()[0].top;
        console.log(iconsHeight)
        this.ref.current.style.position = 'fixed';
        this.ref.current.style.top = `${iconsHeight}px`;
    }


    render() {
        return (
            <div className="clue-icon-container" ref={this.ref}>
                {this.props.state.current_turn_clues.map((e, i) => (
                    <ClueIcon
                        value={e[2] ? 'correct' : 'incorrect'}
                        key={i}
                        isButton={false} />
                ))}
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
            const copyGameData = JSON.parse(JSON.stringify(gameData));
            dispatch(updateGameData(copyGameData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreCount);
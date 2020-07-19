import React, { Component } from "react";
import { connect } from 'react-redux';


import { updateGameData } from '../store/actions';

import "../Styles/Variables.scss";

import { Socket } from "socket.io-client";
class ClueIcon extends Component {
   
    constructor(props) {
        super(props)
        this.myElement = null;
        this.myTween = null;
    }

    componentDidMount = () => {
    }

    getIcon = (value) => {
        switch (value) {
            case 'correct':
                return '✔';
            case 'incorrect':
                return '✗';
            case 'unseen':
                return '-';
            default:
                return value;
        }
    }

    handleClick = e => {
        this.togglePressed(e);
        if (!this.props.isButton) return;
        let numberStolen = this.validateStolenPoints(e.target.innerHTML);
        console.log('number stolen: ', numberStolen)
        this.props.updateGameData({
            stolenPoints: numberStolen
        })
    }

    validateStolenPoints = rawValue => {
        if ((rawValue !== 0) && (!rawValue)) return 0;

        let points = Number(rawValue);
        if ((points >= 0) && (points <= this.props.state.words_per_turn)) {
            return points;
        }
        else return 0;
    }

    togglePressed = e => {
        document.querySelectorAll('.circle-icon').forEach(e => e.classList.remove('pressed'));
        e.target.classList.contains('pressed') ? e.target.classList.remove('pressed') : e.target.classList.add('pressed');
    }

    render() {
        return (
            <div className={`circle-icon ${this.props.value}`}
                ref={elem => this.myElement = elem}
                onClick={e => this.handleClick(e)}
            >
                {this.getIcon(this.props.value)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ClueIcon);
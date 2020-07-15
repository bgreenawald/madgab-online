
import React, { Component } from "react";
import { connect } from 'react-redux';

import Countdown from './Countdown';
import ClueIcon from './ClueIcon';

import { updateGameData } from '../store/actions';

import io from 'socket.io-client';

let socket = io('http://localhost:5000')

class Stealing extends Component {

    constructor(props) {
        super(props);
        this.myElement = null;
        this.availablePoints = 0;
    }

    componentDidMount = () => {
        this.calculateAvailablePoints();
    }

    calculateAvailablePoints = () => {
        this.props.updateGameData({
            availablePoints: Number(this.props.state.words_per_turn) - Number(this.props.state.current_turn_correct)
        })
    }

    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 3
        });

        // launch countdown component
    }

    render() {
        if (this.props.state.inCountdown === true) {
            return (
                <div className="game-content">
                    <Countdown loadingMessage="Ready?" />
                </div>
            )
        }
        else {

            return (

                <div className="game-content">
                    <h2>{this.props.state.opposingTeam} team, you get 10 seconds to steal {this.props.state.availablePoints} points from the {this.props.state.currentTeam} team!</h2>
                    <button className="primary" onClick={this.submitSteal}>Let's steal!</button>
                    <div className="tooltip-icon">?
                        <div className="tooltip modal"><span>these are the rules</span></div>
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
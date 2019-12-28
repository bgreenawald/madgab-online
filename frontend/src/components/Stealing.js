import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss";
import { connect } from 'react-redux';
import Countdown from './Countdown';
import { updateGameData } from '../store/actions';

class Stealing extends Component {
    componentDidMount = () => {
        this.props.updateGameData({
            inCountdown: true
        })
    }
    render() {
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        if (this.props.state.inCountdown) {
            return (<div className="game-content">
                <div className="stealing-container">
                    <p>
                        {currentTeam} start stealing in...
                    </p>
                    <Countdown inheritedCountdown={[3, 2, 1]} />
                </div>
            </div>
            )
        }
        return (
            <div className="game-content">
                <div className="stealing-container">
                    <Countdown inheritedCountdown={['10...']} />
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
        updateGameData: gameData => {
            dispatch(updateGameData(gameData))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stealing);
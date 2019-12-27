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
        if (this.props.state.inCountdown) {
            return (<Countdown />)
        }
        return (
            <div className="game-content">
                <div className="stealing-container">
                    in steal
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
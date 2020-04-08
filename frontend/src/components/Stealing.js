import "../Styles/App.scss";
import "../Styles/Game.scss";

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
      
    }
    componentDidMount = () => {
    }


    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 3
        })
    }

    render() {
        return (
            <div className="game-content">
              <h2>Stealing component</h2>
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
import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss";
import { connect } from 'react-redux';
import Countdown from './Countdown';
import ClueIcon from './ClueIcon';
import { updateGameData } from '../store/actions';
import io from 'socket.io-client';


let socket = io('http://localhost:5000')

class Stealing extends Component {
    componentDidMount = () => {
        this.props.updateGameData({
            inCountdown: true
        })
    }

    generateScoreArray = () => {

    }

    calculateNumberToSteal = () => {
        this.cluesIcons = [];
        this.cluesToSteal = this.props.state.current_turn_counter - this.props.state.current_turn_correct;
        for (let i = 0; i < this.cluesToSteal; i++) {
            this.cluesIcons.push(<ClueIcon value='test' />)
        }
    }

    submitSteal = () => {
        socket.emit("steal", {
            "name": this.props.state.id,
            "points": 3
        })
    }

    countStolen = () => {

    }

    render() {
        this.calculateNumberToSteal();
        let currentTeam = this.props.state.team_1_turn ? "Blue Team" : "Red Team";
        let opposingTeam = this.props.state.team_1_turn ? "Red Team" : "Blue Team";

        return (
            <div className="game-content">
                <p>How many clues did you steal?</p>
                {this.cluesIcons}
            </div>

        )
        // if (this.props.state.inCountdown) {
        //     return (<div className="game-content">
        //         <div className="stealing-container">
        //             <p>
        //                 {currentTeam} start stealing in...
        //             </p>
        //             <Countdown inheritedCountdown={[3, 2, 1]} />
        //         </div>
        //     </div>
        //     )
        // }
        // return (
        //     <div className="game-content">
        //         <div className="stealing-container">
        //             <p>{currentTeam}, you got {this.props.state.current_turn_correct}/{this.props.state.current_turn_counter} clues correct</p>
        //             <p>{opposingTeam}, here's your chance to steal {this.cluesToSteal} clues</p>
        //             {/* show score count animation */}
        //             {/* <Countdown inheritedCountdown={['10...', "Time's up!"]} /> */}
        //         </div>
        //     </div>
        // )
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
import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss";
import { connect } from 'react-redux';
import Countdown from './Countdown';

class Stealing extends Component {
    render() {
        return (
            <div className="game-content">
                <div className="stealing-container">
                    <Countdown />
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

// const mapDispatchToProps = dispatchEvent => {
//     return null;
// }

export default connect(mapStateToProps)(Stealing);
import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss"
import io from "socket.io-client";

import { connect } from 'react-redux';

class ClueIcon extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="circle-icon">
                {this.props.value}
            </div>
        )
    }
}

export default ClueIcon;
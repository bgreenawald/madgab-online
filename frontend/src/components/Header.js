import React, { Component } from 'react';
import '../App.scss'

class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        { this.state && console.log(this.state) }
        return (
            <div className="header">
                    <h3>Round 1</h3>
                    <div className="score-box">
                        <span className="current-team-score">0 -</span>
                        <span className="opposing-team-score"> 0</span>
                    </div>
            </div>
        )
    }
}

export default Header
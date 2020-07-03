import React, { Component } from "react";
import "../Styles/Variables.scss";

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
    render() {
        return (
            <div className={`circle-icon ${this.props.value}`} ref={elem => this.myElement = elem}>
                {this.getIcon(this.props.value)}
            </div>
        )
    }
}

export default ClueIcon;
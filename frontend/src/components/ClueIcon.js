import React, { Component } from "react";
import "../Styles/App.scss";
import "../Styles/Game.scss"
// import { connect } from 'react-redux';

// import { gsap } from "gsap/dist/gsap";
// import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
// import { TimelineLite, CSSPlugin } from "gsap/all";



class ClueIcon extends Component {
    constructor(props) {
        super(props)
        this.myElement = null;
        this.myTween = null;
    }

    componentDidMount = () => {
        // this.myTween = new TimelineLite({ paused: false })
        //     .to(this.myElement, 0.5, { y: -100, opacity: 1 })
        //     .play();
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
                return null;
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
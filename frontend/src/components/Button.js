import React, {Component} from 'react';
import '../Styles/Normalize.scss'

export default class Button extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <a href="" className={`${this.props.buttonRole} button`}>{this.props.text}</a>
           
        )
    }

}

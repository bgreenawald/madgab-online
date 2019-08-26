import React, {Component} from 'react';
import '../App.scss'

class Header extends Component {
    constructor(props) {
        super(props)
        // this.state = props.history.location
    }
    componentDidMount = () => {
        // this.setState({...this.props.props})
        console.log("MY STATE", this.state)
    }

    render(){
        console.log("in the render")
        // if (this.state)
        return(
            <div className="header">
                <div className="flex">
                <div className="header-top">
                    <div className="flex">
                        <h3>Round 1</h3>
                        <div className="score-box">
                            <span className="current-team-score">0 -</span>
                            <span className="opposing-team-score"> 0</span>
                        </div>
                    </div>
                </div>
                <div className="header-bottom">
                        <img src="" alt=""/>
                        {/* insert radgab logo here */}
                        <p>image goes here</p>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Header
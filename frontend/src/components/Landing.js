import React, {Component} from 'react';
import $ from 'jquery';
import '../Styles/App.scss'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            game_id: "", 
            used_ids: [],
            rand_id: 0,
            isRulesOpen: false
        }
        this.input_name = React.createRef()
        this.createGame = this.createGame.bind(this)
        this.generateID = this.generateID.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    
    generateID = () => {
        var min = 0;
        var max = 999999;
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        this.setState({
            rand_id: random
        });
    }
    
    createGame = () => {
        fetch("http://localhost:5000/api/get_names")
        .then(res => {
            this.setState({
                game_id: this.input_name.current.value
            }) 
            if (this.state.used_ids.includes(this.state.game_id)) {
                document.getElementById("error").innerHTML = "ID already in use, choose another"
            }
            else {
                this.props.history.push(`/game/${this.state.game_id}`, {
                    game_id: this.state.game_id
                })
            }
        });
    }

    toggleRules = () => {
        this.setState({
            isRulesOpen: !this.state.isRulesOpen
        })
    }

    closeModal = () => {
        console.log(this.isRulesOpen)
        if(this.state.isRulesOpen) {
            this.setState({
                isRulesOpen: false
            })
        }
    }

    async componentDidMount() {
        await $.ajax({
            url: "http://localhost:5000/api/get_names"
        }).done(res => {

            this.generateID()
            
            this.setState({
                used_ids: res["ids"]
            })
    
            while (this.state.used_ids.includes(this.state.rand_id)) {
                this.generateID()
            }
    
            Array.from(document.getElementsByClassName('game-id-input'))[0].value = this.state.rand_id;
        })
    }



    render() {
        return (
            <div className="home-container" id="css3-background-texture" onClick={this.closeModal}>
                <div className={this.state.isRulesOpen ? 'overlay open' : 'overlay closed'}></div>
                <div className="gradient"></div>
                <div className="home-content flex">
                    <h2 className="title">Welcome to</h2>
                    <h1 className="title" id="home-title-madgab">MADGAB</h1>
                   <h3 className="game-id-label">Game ID:</h3>
                    <input aria-label="game id input field" className="game-id-input" id="game_id" type="text" ref={this.input_name}></input>
                    <button aria-label="submit" type="submit" onClick={this.createGame} className="primary-button start-game-button"> Start Game</button>
                    <div id="error"></div>
                </div>
                <div className="rules-container" className={this.state.isRulesOpen ? 'rules-container open' : 'rules-container closed'}>
                    <div id="rules-button" onClick={this.toggleRules}>
                        <h3>Rules</h3>
                    </div>
                    {/* <FontAwesomeIcon icon={faTimesCircle} className="close-button"/> */}
                    <p>These are the rules of madgab. blah blah blah blah Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ut animi nesciunt, officia corrupti dolor alias ipsam facilis aliquid saepe fugit velit id ipsa eius incidunt ullam voluptates praesentium officiis. </p>
                </div>
            </div>
        )
    }
}

export default Landing
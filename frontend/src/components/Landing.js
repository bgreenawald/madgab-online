import React, {Component} from 'react';
import $ from 'jquery';

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            game_id: "", 
            used_ids: [],
            rand_id: 0
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
        fetch("http://localhost:5000/api/get_names").then(res => {
            console.log("RES:", res)
            // this.state.used_ids = res["ids"];
            console.log("GAME ID", this.input_name.current.value)
            this.setState({
                game_id: this.input_name.value
            }) 
            if (this.state.used_ids.includes(this.state.game_id)) {
                document.getElementById("error").innerHTML = "ID already in use, choose another"
            }
            else {
                console.log("Success")
                console.log(this.state)
                window.location.href = "/" + this.state.game_id;
            }
            console.log(res["ids"])
        });
    }

    async componentDidMount() {
        console.log(this)
        await $.ajax({
            url: "http://localhost:5000/api/get_names"
        }).done(res => {
            console.log(res)

            this.generateID()
            
            this.setState({
                used_ids: res["ids"]
            })
    
            while (this.state.used_ids.includes(this.state.rand_id)) {
                this.generateID()
            }
    
            document.getElementById("game_id").value = this.state.rand_id;
        })
    }


    render() {
        return (
            <div className="home-container" id="css3-background-texture">
                <div className="gradient"></div>
                <div className="rules-container">
                    <button>rules</button>
                </div>
                <div className="home-content flex">
                    <h1>Welcome to MadGab</h1>
                    <p>
                        Enter a game ID, or accept the default. Once you start, you will
                        recieve a URL to share with your friends so they can join.
                    </p>
                    <input id="game_id" type="text" ref={this.input_name}></input>
                    <button type="submit" onClick={this.createGame}>Create New Game</button>
                    <div id="error"></div>
                </div>
            </div>
        )
    }
}

export default Landing
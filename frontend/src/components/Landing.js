import React, {Component} from 'react';
import $ from 'jquery';

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            input_name: "", 
            used_ids: "",
            rand_id: 0
        }
        this.createGame = this.createGame.bind(this)
        this.generateID = this.generateID.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }
    
    generateID = () => {
        var min = 0;
        var max = 999999;
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        return random;
    }
    
    createGame = () => {
        fetch("http://localhost:5000/api/get_names").then(function (res) {
            // console.log(this.state)
            // this.state.used_ids = res["ids"];
            // console.log(this.state.used_ids);
            // this.state.input_name = document.getElementById("game_id").value;
            // console.log(this.state.input_name);
            // if (this.state.used_ids.includes(this.state.input_name)) {
            //     document.getElementById("error").innerHTML = "ID already in use, choose another"
            // }
            // else {
            //     console.log("Success")
            //     window.location.href = "/" + this.state.input_name;
            // }
            console.log(res["ids"])
        });
    }

    async componentDidMount() {
        // console.log(this.state)
        await $.ajax({
            url: "http://localhost:5000/api/get_names",
        }).done(function(res) {
            // console.log(res)

            // let newID = this.generateID()
            
            // this.setState({
            //     used_ids: res["ids"],
            //     rand_id: newID
            // })
    
            // while (this.state.used_ids.includes(this.state.rand_id)) {
            //     this.state.rand_id = this.generateID()
            // }
    
            // document.getElementById("game_id").value = this.state.rand_id;
        });
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
                    <input id="game_id" type="text"></input>
                    <button type="submit" onClick={this.createGame}>Create New Game</button>
                    <div id="error"></div>
                </div>
            </div>
        )
    }
}

export default Landing
import React, { Component } from 'react'

class Landing extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div class="home-container" id="css3-background-texture">
                <div class="gradient"></div>
                <div class="rules-container">
                    <button>rules</button>
                </div>
                <div class="home-content flex">
                    <h1>Welcome to MadGab</h1>
                    <p>
                        Enter a game ID, or accept the default. Once you start, you will
                        recieve a URL to share with your friends so they can join.
                    </p>
                    <input id="game_id" type="text"></input>
                        <button type="submit" onclick="createGame()">Create New Game</button>
                        <div id="error"></div>
                </div>
            </div>
                )
            }
        }
        
export default Landing
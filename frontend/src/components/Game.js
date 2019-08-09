import React, {Component} from 'react';
import '../App.scss'

class Game extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("GAME:", this.props.state)
        return(
        <div>
            <h1>Welcome to game ID </h1>
            <h2>Game state</h2>
            <div>
                <ul>
                    <li>Team 1 scored: <span id="team_1_score"></span></li>
                    <li>Team 2 scored: <span id="team_2_score"></span></li>
                    <li>State: <span id="state"></span></li>
                    <li>Winning team: <span id="winning_team"></span></li>
                    <li>Difficulty: <span id="difficulty"></span></li>
                </ul>
            </div>
        
            <h2>Turn state</h2>
            <p>Turn timer: <p id="timer"></p></p>
            <div>
                <ul>
                    <li>Team 1 Turn: <span id="team_1_turn"></span></li>
                    <li>Current phrase: <span id="current_phrase"></span></li>
                    <li>Current phrase category: <span id="current_category"></span></li>
                    <li>Current madgab: <span id="current_madgab"></span></li>
                    <li>Current turn clues: <span id="current_turn_clues"></span></li>
                    <li>Current turn counter: <span id="current_turn_counter"></span></li>
                    <li>Current turn correct: <span id="current_turn_correct"></span></li>
                </ul>
            </div>
        
            <h2>Game actions</h2>
            <div>
                <button onclick="load_board()">Load board</button>
                <button onclick="toggle_difficulty()">Toggle difficulty</button>
                <button onclick="start_turn()">Start turn</button>
                <button onclick="reset_game()">Reset game</button>
                <button onclick="new_phrase(false)">Pass word</button>
                <button onclick="new_phrase(true)">Got word</button>
                <button onclick="end_turn(true)">End turn - got last word</button>
                <button onclick="end_turn(false)">End turn - missed last word</button>
                <h4>Steal amount</h4>
                <select id="steal_amount">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                <button onclick="steal()">Steal</button>
            </div>
            </div>
        )
    }
}

export default Game
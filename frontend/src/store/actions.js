// TODO: test error/validation
// let validateUnusedId = (existingIdsArray, choosenId) => {
//     if (existingIdsArray.includes(choosenId)) {
//         return false
//     }
//     else return true
// }

import { rootReducer, store } from "../reducers/rootReducer";

import io from "socket.io-client";

const socket = io("http://localhost:5000/");

export const fetchGameData = (id) => {
    return (dispatch, getState) => {

        fetch("http://localhost:5000/api/get_names")
            .then(res => res.json())
            .then(json => {
                // let registerIDSuccess = validateUnusedId(json.ids, id);
                dispatch({ type: 'FETCH_GAME_DATA', json })
            })
            .catch(err => dispatch({ type: 'GAME_DATA_ERROR' }))
    }
}

export const toggleRules = (rulesStatus) => {
    return (dispatch, getState) => {
        dispatch({
            type: 'TOGGLE_RULES'
        })
    }
}

export const generateID = () => {
    var min = 0;
    var max = 999999;
    var random = Math.floor(Math.random() * (+max - +min)) + +min;
    return (dispatch, getState) => {
        dispatch({
            type: 'GENERATE_ID',
            id: random
        })
    }
}

export const updateGameData = (gameData) => {
    return (dispatch, getStsate) => {
        dispatch({
            type: 'UPDATE_GAME_DATA',
            gameData
        })
    }
}

export const startTurn = () => {

    return (dispatch, getState) => {
        console.log('starting the turn')
        // socket.emit("start_turn", {
        //     "name": getState().id
        // })
        // socket.on('reply', (data) => {
        //     console.log('socket data', data)
        // })
        socket.on("connect", resp => {
            socket.emit("start_turn", {
                name: getState().id
            });
            // console.log("start response:", resp)
        });
        dispatch({
            type: 'START_TURN'
        })
    }
}

export const decreaseTimer = () => {
    return (dispatch, getState) => {
        let startingCount = getState().timer;
        console.log('decreasing in actions')
        dispatch({
            type: 'DECREASE_TIMER',
            newCount: --startingCount
        })
    }
}

export const fetchGameData = (id) => {
    return (dispatch, getState) => {

        fetch(process.env.REACT_APP_BACKEND_URL + '/api/get_names')
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
    return (dispatch, getState) => {
        // console.log('update game state', gameData)

        dispatch({
            type: 'UPDATE_GAME_DATA',
            gameData
        })
    }
}

export const startTurn = () => {

    return (dispatch, getState) => {
        dispatch({
            type: 'START_TURN'
        })
    }
}

export const decreaseTimer = () => {
    return (dispatch, getState) => {
        let startingCount = getState().timer;
        dispatch({
            type: 'DECREASE_TIMER',
            newCount: --startingCount
        })
    }
}

export const toggleUserRole = () => {
    return (dispatch, getState) => {
        let newRole = "reader";
        if (getState().userRole === "reader") newRole = "guesser"
        dispatch({
            type: 'TOGGLE_USER_ROLE',
            userRole: newRole
        })
    }
}
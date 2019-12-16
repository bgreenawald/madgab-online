// TODO: test error/validation
let validateUnusedId = (existingIdsArray, choosenId) => {
    if (existingIdsArray.includes(choosenId)) {
        return false
    }
    else return true
}

export const fetchGameData = (id) => {
    return (dispatch, getState) => {

        fetch("http://localhost:5000/api/get_names")
            .then(res => res.json())
            .then(json => {
                console.log('json', json)
                let registerIDSuccess = validateUnusedId(json.ids, id);
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
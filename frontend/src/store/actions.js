let validateUnusedId = (existingIdsArray, choosenId) => {
    // if (this.state.used_ids.includes(choosenId)) {
    //     document.getElementById("error").innerHTML =
    //       "ID already in use, choose another";
    //   } else {
    //     this.props.history.push(`/game/${this.state.game_id}`, {
    //       game_id: this.state.game_id
    //     });
    if (existingIdsArray.includes(choosenId)) {
        return false
        // "ID already in use, choose another"
    }
    else return true
    // }
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
        // .catch(err => dispathc({ type: 'GAME_DATA_ERROR'}))
    }
}
import React, {Component} from 'react';

class GameOver extends Component {
    constructor() {
        super(props)
    }
}


const mapStateToProps = state => {
    return {
        state: { ...state }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateGameData: gameData => {
            dispatch(updateGameData(gameData))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameOver);
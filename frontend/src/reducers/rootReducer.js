// import { combineReducers } from 'redux';

const initState = {
  gameID: "loading...",
  areRulesOpen: false,
  inTurn: false
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_GAME_DATA':
      return {
        ...state,
        existingGameIDs: action.json.ids
      };
    case 'TOGGLE_RULES':
      return {
        ...state,
        areRulesOpen: !state.areRulesOpen
      };
    case 'GENERATE_ID':
      return {
        ...state,
        gameID: action.gameID
      };
    case 'START_TURN':
      return {
        ...state,
        inTurn: !state.inTurn
      }
    case 'UPDATE_GAME_DATA':
      return {
        ...state,
        ...action.gameData
      }
    default:
      return state;
  }
};

export default rootReducer;

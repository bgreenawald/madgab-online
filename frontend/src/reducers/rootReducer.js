import { combineREducers } from 'redux';

const initState = {
  gameID: "loading...",
  areRulesOpen: false
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_GAME_DATA':
      return {
        ...state,
        gameData: action.json.ids
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
      }
    default:
      return state;
  }
};

export default rootReducer;

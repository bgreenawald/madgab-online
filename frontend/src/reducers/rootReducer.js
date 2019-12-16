import { combineREducers } from 'redux';

const initState = {
  user: "jocelyn",
  password: "pass123",
  pokemon: "ampharos",
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
      }
    default:
      return state;
  }
};

export default rootReducer;

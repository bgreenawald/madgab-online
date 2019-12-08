import { combineREducers } from 'redux';

const initState = {
  user: "jocelyn",
  password: "pass123",
  pokemon: "ampharos"
};

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_GAME_DATA':
      return {
        ...state,
        gameData: action.json.ids
      };
    default:
      return state;
  }
};

export default rootReducer;

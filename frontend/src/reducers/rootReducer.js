// import { combineReducers } from 'redux';

const initState = {
  id: "loading...",
  areRulesOpen: false,
  inTurn: false,
  userRole: 'guesser',
  scoreArray: [],
  difficulty: 'easy',
  currentTeam: "blue",
  stolenPoints: 0
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
        id: action.id
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
    case 'DECREASE_TIMER':
      return {
        ...state,
        timer: action.newCount
      }
    case 'TOGGLE_USER_ROLE':
      return {
        ...state,
        userRole: action.userRole
      }
    default:
      return state;
  }
};

export default rootReducer;

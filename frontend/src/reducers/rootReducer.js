const initState = {
  user: "jocelyn",
  password: "pass123",
  pokemon: "ampharos"
};

const rootReducer = (state = initState, action) => {
  console.log(action);
  return state;
};

export default rootReducer;

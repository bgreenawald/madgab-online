import React, { Component } from "react";
import "../Styles/App.scss";
import { connect } from "react-redux";
import { fetchGameData, toggleRules, generateID } from '../store/actions';
import { gsap } from 'gsap';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.input_name = React.createRef();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadingAnimation = gsap.timeline({ defaults: { duration: 1, ease: 'power3' } });
  }

  componentDidMount() {
    this.props.fetchGameData();
    this.props.generateID();
    this.loadingAnimation
      .from('h2.title', {
        opacity: 0,
        y: 30,
      })
      .from('h1.title', {
        opacity: 0,
        y: 30
      }, '-=.5')
      .from('.game-id-label', {
        duration: 0.5,
        opacity: 0,
        x: 10
      }, '-=.3')
      .from('div.input-container', {
        opacity: 0,
        y: 30,
      }, '-=.5')
      .from('button.start-game-button', {
        opacity: 0,
        y: 40
      }, '-=0.5')
  }
  

  generateID = () => {
    this.props.generateID();
  };
  createGame = () => {
    this.props.fetchGameData(this.input_name.current.value);
    this.props.history.push(`/game/${this.input_name.current.value}`, {
      game_id: this.input_name.current.value
    });
  };

  toggleRules = () => {
    this.props.toggleRules();
  };

  closeModal = () => {
    if (this.props.state.areRulesOpen) {
      this.props.toggleRules();
    }
  };

  render() {
    return (
      <div
        className="home-container"
        id="css3-background-texture"
        onClick={this.closeModal}
      >
        <div
          className={this.props.state.areRulesOpen ? "overlay open" : "overlay closed"}
        ></div>
        <div className="gradient"></div>
        <div className="home-content flex">
          <h2 className="title">Welcome to</h2>
          <h1 className="title" id="home-title-madgab">
            MADGAB
          </h1>
          <h3 className="game-id-label">Game ID:</h3>
          <div className="input-container">
            {this.props.state.id === "loading..." ? (<h1>Loading...</h1>) :
              (<input id="game_id" aria-label="game id input field" type="text"
                className="game-id-input"
                ref={this.input_name}

                defaultValue={this.props.state.id}
              ></input>)}
          </div>

          <button className="primary button start-game-button" aria-label="submit"
            type="submit"
            onClick={this.createGame}
            disabled={this.props.state.id === "loading..." ? true : false}
          >
            Start Game
          </button>
          <div id="error"></div>
        </div>
        <div
          className={
            this.props.state.areRulesOpen
              ? "rules-container open"
              : "rules-container closed"
          }
        >
          <div id="rules-button" onClick={this.toggleRules}>
            <h3>Rules</h3>
          </div>
          <p>
            These are the rules of madgab. blah blah blah blah Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Quo ut animi nesciunt,
            officia corrupti dolor alias ipsam facilis aliquid saepe fugit velit
            id ipsa eius incidunt ullam voluptates praesentium officiis.{" "}
          </p>
          <span className="close-button">x close</span>
        </div>
      </div >
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchGameData: (gameId) => {
      dispatch(fetchGameData(gameId));
    },
    toggleRules: (areRulesOpen) => {
      dispatch(toggleRules(areRulesOpen));
    },
    generateID: () => {
      dispatch(generateID());
    }
  };
};

const mapStateToProps = state => {
  return {
    state: { ...state }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);

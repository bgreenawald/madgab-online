import React, { Component } from "react";
import "../Styles/App.scss";
import { connect } from 'react-redux';

class Stealing extends Component {
    render() {
        return (
            <div>testing</div>
        )
    }
}

const mapStateToProps = state => {
    return {
        state: { ...state }
    }
}

// const mapDispatchToProps = dispatchEvent => {
//     return null;
// }

export default connect(mapStateToProps)(Stealing);
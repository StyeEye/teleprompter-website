import React, { Component } from 'react';
import { connect } from 'react-redux';

import "./header.css";

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.props)
        return (
            <div className="Header">
                <h1>{this.props.username}</h1>
                Header
            </div>
        )
    }
}

export default connect(state => state)(Header);
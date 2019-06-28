import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import "./header.css";

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.props)
        return (
            <div className="Header">
                <Link to="/">
                    <div className="main-icon"></div>
                </Link>
                <div className="header-links">
                    <Link to="/edit" className="edit-icon-container">
                        <div className="edit-icon link-icon"></div>
                    </Link>
                    <Link to="/play">
                        <div className="play-icon link-icon"></div>
                    </Link>
                </div>
                <div>
                    <h1>{this.props.username}</h1>
                    <button>Logout</button>
                </div>
            </div>
        )
    }
}

export default connect(state => state)(Header);
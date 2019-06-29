import React, { Component } from 'react';

import Header from "../../shared/header/header.js";

class Play extends Component {
    render() {
        return (
            <div className="Play">
                <Header />
                <div className="play-setup">
                    <input type="number" placeholder="Timelimit"/>
                </div>
                Play
            </div>
        )
    }
}

export default Play;
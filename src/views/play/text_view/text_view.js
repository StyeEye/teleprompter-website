import React, { Component } from 'react';

import "./text_view.css";

class TextView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.show)
            return null;

        let swipeAnimation = {};
        let delayAnimation = {};
        if (this.props.playing) {
            if (this.props.onDelay)
                delayAnimation = {
                    animation: `play_delay ${this.props.event.data.delay}s linear forwards`
                }
            else {
                swipeAnimation = {
                    animation: `play_wipe ${this.props.event.data.length}s linear forwards`
                }
                delayAnimation = { backgroundColor: "white" };
            }
        }

        const instructions = this.props.event.data.instructions ?
            <p>{this.props.event.data.instructions}</p> : null;
        const instructImage = this.props.event.data.instructImage ?
            <img src={this.props.event.data.instructImage} alt="Bad image" /> : null;
        const showSecondBox = Boolean(instructions || instructImage);
        return (
            <div className="TextView">
                <div className="text-view-text" style={delayAnimation}>
                    <p><span style={swipeAnimation}>{this.props.event.data.text}</span></p>
                </div>
                {showSecondBox ?
                    <div className="text-view-instruct" style={delayAnimation}>
                        <p>{this.props.event.data.instructions}</p>
                        <img src={this.props.event.data.instructImage} alt="" />
                    </div> : null
                }
            </div>
        )
    }
}

export default TextView;
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from "../../shared/header/header.js";
import TextView from "./text_view/text_view"

class Play extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeLimit: 1,
            currentEvent: 0,
            nextTime: 0,
            isPlaying: false,
            endTime: 0,
            onDelay: false
        }
    }

    startPlaying = () => {
        this.setState({
            isPlaying: true,
            endTime: Date.now() + this.state.timeLimit * 60000,
            nextTime: Date.now() + 100
        }, this.playNext);
    }

    playNext = (useDelay = true) => {
        console.log(this.state.currentEvent)
        const elem = this.props.events.find(e => e.data.index === this.state.currentEvent);

        if (!elem) {
            console.log("Reached last event in chain");
            this.stopPlaying();
            return;
        }

        const startDelay = Math.max(elem.data.delay * 1000, 0);
        const interval = startDelay + Math.max(elem.data.length*1000, 0);
        const drift = Date.now() - this.state.nextTime;

        this.setState({
            nextTime: this.state.nextTime + interval,
            onDelay: startDelay > 0
        }, () => {
            setTimeout(() => {
                this.setState({
                    onDelay: false
                })
            }, Math.max(startDelay - drift, 0));

            setTimeout(() => {
                this.setState({
                    onDelay: true,
                    currentEvent: this.state.currentEvent + 1
                }, this.playNext)
            }, Math.max(interval - drift, 0));
        })
    }

    stopPlaying = () => {
        this.setState({
            isPlaying: false,
            endTime: 0,
            currentEvent: 0
        })
    }

    render() {
        const cards = this.props.events.map((e, i) => {
            const playing = e.data.index === this.state.currentEvent && this.state.isPlaying;
            return <TextView event={e} show={e.data.index >= this.state.currentEvent} playing={playing} onDelay={this.state.onDelay}/>
        });

        return (
            <div className="Play">
                <Header />
                <div className="play-setup">
                    <input type="number" placeholder="Timelimit" />
                </div>
                Play
                <button onClick={this.startPlaying}>Test</button>
                <div className="card-container">
                    {cards}
                </div>
            </div>
        )
    }
}

export default connect(state => state)(Play);
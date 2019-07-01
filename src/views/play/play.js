import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from "../../shared/header/header.js";
import TextView from "./text_view/text_view";

import "./play.css";

class Play extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeLimit: 1,
            currentEvent: 0,
            nextTime: 0,
            isPlaying: false,
            endTime: 0,
            onDelay: false,
            timeLeft: 0,
            nextSecond: 0
        }
    }

    startPlaying = () => {
        const now = Date.now();
        this.setState({
            isPlaying: true,
            endTime: now + this.state.timeLimit * 60000,
            nextTime: now + 100,
            timeLeft: Math.floor(this.state.timeLimit * 60),
            nextSecond: now + 1000
        }, this.playNext);

        setTimeout(this.countDown, 1000);
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
        const interval = startDelay + Math.max(elem.data.length * 1000, 0);
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
            currentEvent: 0,
            timeLeft: 0,
            nextSecond: 0
        })
    }

    countDown = () => {
        if (!this.state.isPlaying)
            return;

        const drift = Date.now() - this.state.nextSecond;
        const nextDelay = Math.max(1000 - drift, 0);
        const nextSecond = this.state.nextSecond + 1000;

        this.setState({
            timeLeft: this.state.timeLeft - 1,
            nextSecond: nextSecond
        });

        setTimeout(this.countDown, nextDelay);
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    render() {
        const cards = this.props.events.map((e, i) => {
            const playing = e.data.index === this.state.currentEvent && this.state.isPlaying;
            return <TextView event={e} show={e.data.index >= this.state.currentEvent} playing={playing} onDelay={this.state.onDelay} />
        });

        const mainBody = this.state.isPlaying ?
            <div className="play-countdown">
                <p style={{ animation: `play_countdown linear forwards ${this.state.timeLimit * 60}s` }}>{`Time left: ${this.state.timeLeft}`}</p>
                <div className="card-container">{cards}</div>
            </div> :
            (<div className="play-setup">
                <input type="number" placeholder="Timelimit" value={this.state.timeLimit} onChange={this.onChange} name="timeLimit" />
                Play
                <button onClick={this.startPlaying}>Test</button>
            </div>);

        return (
            <div className="Play">
                <Header />
                {mainBody}
            </div>
        )
    }
}

export default connect(state => state)(Play);
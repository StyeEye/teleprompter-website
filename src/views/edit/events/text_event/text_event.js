import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateEvent, removeEvent } from "../../../../redux/action_creators/action_creators";
import axios from 'axios';

import "./text_event.css";

class TextEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false
        }
    }

    onChange = (event) => {
        const newData = Object.assign({}, this.props.data);

        newData[event.target.name] = event.target.value;
        console.log(event.target.name);
        this.props.updateEvent(newData);
    }

    onPlay = (event) => {
        const shouldStart = !this.state.isPlaying;

        this.setState({
            isPlaying: shouldStart
        })

        if (shouldStart) {
            setTimeout(() => {
                this.setState({
                    isPlaying: false
                })
            }, this.props.data.length * 1000 + 100);
        }
    }

    removeEvent = (event) => {
        const id = this.props.data.id;

        axios.delete(`/api/events?eventId=${id}`)
            .then(response => {
                if (response.data.success) {
                    this.props.removeEvent(id)
                } else
                    console.log(`Could not delete event ${id}`)
            })
            .catch(err => {
                console.log("Could not remove event: ", err)
            })
    }

    render() {
        const styling = this.state.isPlaying ?
            { animation: `background_wipe ${this.props.data.length}s linear forwards` } :
            {};

        return (
            <div className="TextEvent">
                <input type="text" name="text" value={this.props.data.text}
                    onChange={this.onChange} style={styling} />
                <div className="text-action">
                    <h1>Instructions</h1>
                    <div className="text-image"></div>
                    <input type="text" placeholder="Instructions" />
                    <br />
                    <input type="url" placeholder="Image URL" />
                </div>
                <div className="text-settings">
                    <div className="text-settings-buttons">
                        {/* <input type="button" value="Delete" onClick={this.removeEvent}/> */}
                        <button onClick={this.removeEvent} style={{backgroundImage: `url(https://bigbucketsforever.s3-us-west-1.amazonaws.com/trash-32.png)`}}/>
                        <button onClick={this.onPlay} style={{backgroundImage: `url(https://bigbucketsforever.s3-us-west-1.amazonaws.com/icons8-play-32.png)`}}/>
                        {/* <input type="button" value={this.state.isPlaying ? "Stop" : "Play"} onClick={this.onPlay} /> */}
                    </div>
                    <label htmlFor="length">Seconds:</label>
                    <input type="number" name="length" id="" value={this.props.data.length} onChange={this.onChange} />
                    <br />
                    <label htmlFor="delay">Delay:</label>
                    <input type="number" name="delay" id="" value={this.props.data.delay} onChange={this.onChange} />
                    <br />
                    <label htmlFor="index">Index:</label>
                    <input type="number" name="index" id="" value={this.props.data.index} onChange={this.onChange} />
                </div>
            </div>
        )
    }
}

export default connect(null, { updateEvent, removeEvent })(TextEvent);
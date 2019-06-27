import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateEvent } from "../../../../redux/action_creators/action_creators";

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
        this.setState({
            isPlaying: true
        })

        setTimeout(() => {
            this.setState({
                isPlaying: false
            })
        }, this.props.data.length * 1000 + 100);
    }

    render() {
        const styling = this.state.isPlaying ?
            {animation: `background_wipe ${this.props.data.length}s linear forwards`} :
            {};

        return (
            <div className="TextEvent">
                <input type="text" name="text" value={this.props.data.text}
                    onChange={this.onChange} style={styling}/>
                <div className="text-action">
                    <h1>Instructions</h1>
                    <div className="text-image"></div>
                    <input type="text" placeholder="Instructions" />
                    <br/>
                    <input type="url" placeholder="Image URL" />
                </div>
                <div className="text-settings">
                    <div className="text-settings-buttons">
                        <input type="button" value="Delete" />
                        <input type="button" value="Play" onClick={this.onPlay}/>
                        <input type="button" value="" />
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

export default connect(null, { updateEvent })(TextEvent);
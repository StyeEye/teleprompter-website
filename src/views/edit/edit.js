import React, { Component } from 'react';
import Header from "../../shared/header/header";
import Timeline from "../../shared/timeline/timeline";
import { connect } from 'react-redux';
import axios from 'axios';

import TextEvent from "./events/text_event/text_event"
import Timestamp from "./events/timestamp/timestamp"

import { refreshEvents, addEvent } from "../../redux/action_creators/action_creators";

import "./edit.css";

const eventTypes = Object.freeze({
    textEvent: 1,
    timestamp: 2
});

class Edit extends Component {
    constructor(props) {
        super(props);
    }

    // This is temporary
    componentDidMount() {
        this.loadEvents();
    }

    // Temporary
    loadEvents = () => {
        // this.props.refreshEvents([
        //     {
        //         type: eventTypes.textEvent, data: {
        //             index: 1,
        //             text: "Hello there 1",
        //             length: 2,
        //             delay: 0,
        //             id: 1
        //         }
        //     },
        //     {
        //         type: eventTypes.textEvent, data: {
        //             index: 2,
        //             text: "Hello there 2",
        //             length: 2,
        //             delay: 0,
        //             id: 2
        //         }
        //     },
        //     {
        //         type: eventTypes.textEvent, data: {
        //             index: 3,
        //             text: "Hello there 3",
        //             length: 2,
        //             delay: 0,
        //             id: 3
        //         }
        //     }
        // ])
    }

    addText = () => {
        const index = this.props.events.reduce((index, e) => {
            if (e.type === eventTypes.textEvent || e.types === eventTypes.timestamp)
                return Math.max(index, e.data.index + 1)
            else
                return index;
        }, 1);

        const eventData = {
            index: index,
            length: 1,
            delay: 0,
            text: "",
            instructions: "",
            instructImage: ""
        }

        axios.post("/api/events/create", {
            eventType: eventTypes.textEvent,
            dataVersion: 1,
            eventData: eventData
        })
            .then(response => {
                //console.log(response.data)
                if (response.data.hasOwnProperty("success") && !Boolean(response.data.success))
                    throw `Bad project: ${response.data.message}`;

                const { eventId, eventType, eventData, dataVersion } = response.data.event;
                this.props.addEvent({
                    type: parseInt(eventType),
                    data: {
                        index: parseInt(eventData.index),
                        text: eventData.text,
                        length: parseInt(eventData.length),
                        delay: parseInt(eventData.delay),
                        id: parseInt(eventId),
                        instructions: eventData.instructions,
                        instructImage: eventData.instructImage
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    syncChanges = (event) => {
        const filtered = this.props.events.filter(e => e.hasChanged);
        const body = filtered.map(e => ({
            eventId: e.data.id,
            eventType: e.type,
            dataVersion: 1,
            eventData: {
                index: e.data.index,
                text: e.data.text,
                length: e.data.length,
                delay: e.data.delay,
                instructions: e.data.instructions,
                instructImage: e.data.instructImage
            }
        }));

        axios.patch("/api/events", body)
            .then(response => {

            })
            .catch(err => {
                console.log("Error when syncing:", err);
            })
    }

    render() {
        const events = this.props.events.map(e => {
            switch (e.type) {
                case eventTypes.textEvent:
                    return <TextEvent data={e.data} />;
                case eventTypes.timestamp:
                    return <Timestamp data={e.data} />;
                default:
                    return <div>Bad Event</div>;
            }
        });

        const totalLength = this.props.events.reduce((length, e) => {
            return length + Number(e.data.length) + Number(e.data.delay);
        }, 0);

        return (
            <div className="Edit">
                <Header />
                {/* <Timeline /> */}
                <div className="edit_toolbar">
                    <button onClick={this.addText}>Add Text</button>
                    <button>Add Timestamp</button>
                    <button onClick={this.syncChanges}>Save project</button>
                    <span>Total length: {totalLength} seconds</span>
                </div>
                <div className="edit_center">
                    {events}
                </div>
            </div>
        )
    }
}

export default connect(state => state, { refreshEvents, addEvent })(Edit);
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

        axios.post("/api/project")
            .then(response => {
                if (response.data.hasOwnProperty("success") && !response.data.success)
                    throw `Bad project: ${response.data.message}`;
                else {
                    return axios.get("/api/events")
                }
            })
            .then(response => {
                if (response.data.hasOwnProperty("success") && !response.data.success)
                    throw `Can't get events: ${response.data.message}`;
                else {
                    const events = response.data.map(e => {
                        return {
                            type: parseInt(e.eventType),
                            data: {
                                index: parseInt(e.eventData.index),
                                text: e.eventData.text,
                                length: parseInt(e.eventData.length),
                                delay: parseInt(e.eventData.length),
                                id: parseInt(e.eventId)
                            }
                        }
                    });

                    this.props.refreshEvents(events);
                }
            })
            .catch(err => {
                console.log(err);
            })
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
            text: ""
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
                        delay: parseInt(eventData.length),
                        id: parseInt(eventId)
                    }
                })
            })
            .catch(err => {
                console.log(err);
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
        })
        return (
            <div className="Edit">
                <Header />
                <Timeline />
                <div className="edit_toolbar">
                    <button onClick={this.addText}>Add Text</button>
                    <button>Add Timestamp</button>
                    <button>Save project</button>
                </div>
                <div className="edit_center">
                    {events}
                </div>
            </div>
        )
    }
}

export default connect(state => state, { refreshEvents, addEvent })(Edit);
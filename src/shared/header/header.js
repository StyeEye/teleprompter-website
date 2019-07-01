import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { withRouter } from 'react-router'

import "./header.css";
import { refreshEvents } from "../../redux/action_creators/action_creators";
import DonationForm from "../donation_form/donation_form";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDonate: false
        }
    }

    componentDidMount() {
        this.reloadEvents();
    }

    reloadEvents = () => {
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
                                delay: parseInt(e.eventData.delay),
                                id: parseInt(e.eventId),
                                instructions: e.eventData.instructions,
                                instructImage: e.eventData.instructImage
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

    showDonation = () => {
        this.setState({
            showDonate: true
        });
    }

    hideDonation = () => {
        this.setState({
            showDonate: false
        });
    }

    logout = () => {
        axios.post("/auth/logout")
            .then(response => {
                if (response.data.success)
                    this.props.history.push("/");
                else
                    console.log("Could not log out!");
            })
            .catch(err => {
                console.log("Failure when logging out:", err);
            })
    }

    render() {
        //console.log(this.props)
        const donation = this.state.showDonate ?
            <DonationForm hideFunc={this.hideDonation} /> :
            null;
        return (
            <div className="Header">
                {donation}
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
                    <button onClick={this.showDonation}>Donate! (WIP)</button>
                </div>
                <div className="header-user-box">
                    <h1>{this.props.username}</h1>
                    <button onClick={this.logout}>Logout</button>
                </div>
            </div>
        )
    }
}

export default connect(state => state, { refreshEvents })(withRouter(Header));
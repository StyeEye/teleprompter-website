import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { updateUser } from "../../redux/action_creators/action_creators";

import "./login.css";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    handleChange = event => {
        //console.log(event.target)
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    tryRegistration = () => {
        const body = {
            username: this.state.username,
            password: this.state.password
        };

        axios.post(`/auth/register`, body)
            .then(response => {
                //console.log(response.data);
                const { username, didRegister, message } = response.data;

                console.log(message);

                if (didRegister) {
                    console.log("worked")
                    this.props.updateUser(username);
                    this.props.history.push("/edit");
                }
            })
            .catch(err => {
                console.log(`Registration failed: ${err}`)
            })
    }

    tryLogin = () => {
        const body = {
            username: this.state.username,
            password: this.state.password
        };

        axios.post(`/auth/login`, body)
            .then(response => {
                //console.log(response.data);
                const { username, didLogin, message } = response.data;

                console.log(message);

                if (didLogin) {
                    console.log("worked")
                    this.props.updateUser(username);
                    this.props.history.push("/edit");
                }
            })
            .catch(err => {
                console.log(`Login failed: ${err}`)
            })
    }

    render() {
        return (
            <div className="Login">
                <input type="text" name="username" placeholder="Username"
                    value={this.state.username} onChange={this.handleChange} />
                <input type="password" name="password" placeholder="Password"
                    value={this.state.password} onChange={this.handleChange} />
                <div className="login-buttons">
                    <button onClick={this.tryRegistration}>Register</button>
                    <button onClick={this.tryLogin}>Login</button>
                </div>
            </div>
        )
    }
}

export default connect(null, { updateUser })(Login);
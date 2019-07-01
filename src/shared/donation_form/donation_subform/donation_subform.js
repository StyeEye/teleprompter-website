import React, { Component } from 'react';
import { CardElement, injectStripe, PaymentRequestButtonElement } from 'react-stripe-elements';
import axios from 'axios';

import "./donation_subform.css";

class DonationSubform extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cardHolder: ""
        };
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submit = async (ev) => {
        this.props.stripe.createToken({ name: this.state.cardHolder })
            .then(({ token }) => {
                console.log(token);
                return axios.post("/api/donate", { token: token.id })
            })
            .then(response => {
                console.log(response)
                if (response.statusText.toLowerCase() === "ok")
                    console.log("Purchase worked")
                else
                    console.log("Purchase failed")
            })
            .catch(err => {
                console.log("Payment error:", err);
            })
    }

    cancel = () => {
        this.setState({
            cardHolder: ""
        })
        this.props.hideFunc();
    }
    render() {
        return (
            <div className="DonationSubform">
                <input type="text" name="cardHolder" placeholder="Full Name" value={this.state.cardHolder}
                    onChange={this.onChange} />
                <CardElement />
                {/* <PaymentRequestButtonElement /> */}
                <button onClick={this.submit}>Submit</button>
                <button onClick={this.cancel}>Cancel</button>
            </div>
        )
    }
}

export default injectStripe(DonationSubform);
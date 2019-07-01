import React, { Component } from 'react';

import { CardElement, injectStripe } from 'react-stripe-elements';
import { Elements, StripeProvider } from 'react-stripe-elements';

import DonationSubform from "./donation_subform/donation_subform";

import "./donation_form.css";

class DonationForm extends Component {
    render() {
        return (
            <div className="DonationForm">
                <StripeProvider apiKey="pk_test_W0ok2Hoks9EVo3cKVRcQkjxz00UzWTjDlB">
                    <Elements>
                        <DonationSubform hideFunc={this.props.hideFunc} />
                    </Elements>
                </StripeProvider>
            </div>
        )
    }
}


export default DonationForm;
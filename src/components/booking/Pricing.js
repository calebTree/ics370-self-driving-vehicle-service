import React from "react";
import { Link } from "react-router-dom";

// firebase
import { withFirebase } from "../firebase";

import QRCode from "react-qr-code";
var sha1 = require('sha1');

class PricingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    // load mdl-js* classes
    componentDidMount() {
        componentHandler.upgradeDom();
        // only look for data when a logged in user is available
        this.listener = this.props.firebase.doAuthStateChanged(authUser => {
            authUser
                ? this.props.firebase.doReadBooking().then(data => {
                    this.setState({ data: data });
                })
                : this.setState({ data: null });
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const status = this.state.data ? null : "Please wait ...";
        const price = this.state.data ? "$" + (this.state.data.price / 1000).toFixed(2) : null;
        const origin = this.state.data ? this.state.data.origin : null;
        const destination = this.state.data ? this.state.data.destination : null;
        const distance = this.state.data ? this.state.data.distance : null;
        const rate = "$0.20/KM";
        const bookingID = this.state.data ? sha1(JSON.stringify(this.state.data)) : '';
        console.log(bookingID)
        return (
            <div>
                <section className="content mdl-card mdl-shadow--2dp">
                    <div className="mdl-card__title">
                        <h2 className="mdl-card__title-text">Pricing</h2>
                    </div>
                    {status}
                    <div className="grid-container">
                        <div>
                            <table className="mdl-data-table mdl-js-data-table">
                                <tbody>
                                    <tr>
                                        <th className="mdl-data-table__cell--non-numeric">Pickup:</th>
                                        <td>{origin}</td>
                                    </tr>
                                    <tr>
                                        <th className="mdl-data-table__cell--non-numeric">Destination:</th>
                                        <td>{destination}</td>
                                    </tr>
                                    <tr>
                                        <th className="mdl-data-table__cell--non-numeric">Distance:</th>
                                        <td>{distance}</td>
                                    </tr>
                                    <tr>
                                        <th className="mdl-data-table__cell--non-numeric">Rate:</th>
                                        <td>{rate}</td>
                                    </tr>
                                    <tr>
                                        <th className="mdl-data-table__cell--non-numeric">Price:</th>
                                        <td>{price}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <Link to='/booking/now' className="section-button mdl-button mdl-button--raised mdl-button">Back</Link>
                            <Link to='/booking/confirm' className="section-button mdl-button mdl-button--raised mdl-button--accent">Confirm</Link>
                        </div>
                        <div>
                            {bookingID ? <div>Scan this QR code to unlock the vehicle. <QRCode value={bookingID} />{bookingID}</div> : "Please wait ..." }
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default withFirebase(PricingPage);
import React from "react";

// firebase
import { withFirebase } from "../firebase";

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
        this.listener = this.props.firebase.doAuthStateChanged(authUser => {
        authUser
            ? this.props.firebase.doReadBooking().then(() => {
                this.setState({ data: "data here" });
            })
            : this.setState({ data: null });
        });
    }
    
    componentWillUnmount() {
        this.listener();
    }

    render() {
        const price = this.state.data;
        // console.log(this.state.data);
        return (
            <div>
                <section className="content mdl-card mdl-shadow--2dp">
                    <div className="mdl-card__title">
                        <h2 className="mdl-card__title-text">Pricing</h2>
                    </div>
                    <div className="mdl-grid">
                        The Pricing Page!
                        <br />
                        {price}
                    </div>
                </section>
            </div>
        )
    }
}

export default withFirebase(PricingPage);
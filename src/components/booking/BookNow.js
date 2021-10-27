import React from 'react';

const BookNowPage = () => (
    <div className="mdl-layout">
        <section id="hailForm" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
            <div className="mdl-card__supporting-text">
                <h3>Book a Ride Now</h3>
                <BookNowForm />
            </div>
        </section>
    </div>
)

class BookNowForm extends React.Component {
    
    // load mdl-js* classes
    componentDidMount() {
        componentHandler.upgradeDom();
    }

    render() {
        return (
            <form action="#">
                <div id="name">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label mdl-textfield--full-width">
                        <select id="service" className="mdl-textfield__input" name="service">
                            {/* <option> </option> */}
                            <option>Basic</option>
                            <option>Deluxe</option>
                        </select>
                        <label className="mdl-textfield__label" htmlFor="service">Choose your service</label>
                    </div>
                </div>
                <div id ="contact">
                    {/* <div id="phone" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input id="pickDate" className="mdl-textfield__input" type="text" />
                        <label className="mdl-textfield__label" htmlFor="sample2">Pick up location</label>
                    </div>
                    </div> */}
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input id="dropOff" className="mdl-textfield__input" type="text" name="dropOff" required />
                            <label className="mdl-textfield__label" htmlFor="dropOff">Drop of destination</label>
                        </div>
                    </div>
                    <div id="destination"></div>
                    <div id="myProgress">
                        <div id="myBar" hidden></div>
                    </div>
                </div>
            <button id="hailNowBtn" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Submit</button>
            </form>
        )
    }
}

export default BookNowPage;
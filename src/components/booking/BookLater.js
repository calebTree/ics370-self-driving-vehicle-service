import React from "react";

const BookLaterPage = () => (
  <div className="mdl-layout">
    <section id="scheduleForm" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
      <div className="mdl-card__supporting-text">
          <h3>Book a Future Ride</h3>
          <BookLaterForm />
      </div>
    </section>
  </div>
);

class BookLaterForm extends React.Component {

    // load mdl-js* classes
    componentDidMount() {
        componentHandler.upgradeDom();
    }

    render() {
        return(
          <form action="#">
            <div id ="contact">
              <div id="phone" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input id="pickDate" className="mdl-textfield__input" type="date" />
                  {/* <label className="mdl-textfield__label" htmlFor="sample2">Pick your ride date</label> */}
                </div>
              </div>
              <div id="email" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input className="mdl-textfield__input" type="time" />
                  {/* <label className="mdl-textfield__label" htmlFor="sample2">Enter your pick up time</label> */}
                </div>
              </div>
            </div>
            <div id="name">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <select id="schServ" className="mdl-textfield__input" name="service">
                  <option></option>
                </select>
                <label className="mdl-textfield__label" htmlFor="schServ">Choose your service</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <select id="carType" className="mdl-textfield__input" name="carType">
                  <option></option>							
                </select>
                <label className="mdl-textfield__label" htmlFor="carType">Select your luxury car</label>
              </div>
            </div>
            <button className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Submit</button>
          </form>
        )
    }
}

export default BookLaterPage;
import React from "react";

const BookLaterPage = () => (
  <div>
    <section className="content mdl-card mdl-shadow--2dp">
      <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Book a Future Ride</h2>
        </div>
      <div className="mdl-grid">
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
                  <input name="pickDate" className="mdl-textfield__input" type="date" />
                  {/* to-do: mdl lable overlaps HTML lable */}
                  {/* <label className="mdl-textfield__label" htmlFor="pickDate">Pick your ride date</label> */}
                </div>
              </div>
              <div id="email" className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input name="pickTime" className="mdl-textfield__input" type="time" />
                  {/* to-do: mdl lable overlaps HTML lable */}
                  {/* <label className="mdl-textfield__label" htmlFor="pickTime">Enter your pick up time</label> */}
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
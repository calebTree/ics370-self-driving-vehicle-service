'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const e = React.createElement;

class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }
    var saying = "I say this";
    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like',
      <div>{saying}</div>
    );
  }
}

// ... the starter code you pasted ...

const domContainer = document.querySelector('#greeting');
ReactDOM.render(e(Greeting), domContainer);
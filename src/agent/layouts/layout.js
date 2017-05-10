import React from 'react';

// improt style file
import '../styles/layout.css';

export default class Layout extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {

  }

  render() {
    return (
        <div>
          <div className="appContainer">
            <div className="panelContainer fluid-container">
              <div className="row chatBox">
                <header>
                  <h3>Agent Panel Chat Application</h3>
                </header>
              </div>
              <div className="row sendBox">
                <form action="">
                  <input type="text" placeholder="Type Here...."/>
                  <img src="assets/images/6.png" />
                </form>
              </div>
            </div>
          </div>
        </div>
    )
  }

  componentDidMount() {
    var socket = io();

  }
}

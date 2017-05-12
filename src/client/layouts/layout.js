import React from 'react';

// import css files
import '../styles/layout.css';

export default class Layout extends React.Component {
    constructor() {
      super();

    }

    // before that component rendered
    componentWillMount() {

    }

    render() {
      return(
          <div>
            <div className="appContainer">
              <div  className="chatAppContainer fluid-container">
                <div className="row chatBox">
                    <header>
                      <p>Live Chat application</p>
                    </header>
                    <div className="quotas well">
                      <span>
                        <span>Dani</span>
                        <span>Hi Customer</span>
                      </span>
                    </div>
                </div>
                <div className="row sendBox">
                    <form action="">
                      <input type="text" placeholder="Type Here...."/>
                    </form>
                </div>
              </div>
            </div>
          </div>
      )
    }

    // after that component rendered
    componentDidMount() {

    }

}

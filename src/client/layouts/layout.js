import React from 'react';
import $ from 'jquery';

// import css files
import '../styles/layout.css';

export default class Layout extends React.Component {
    constructor() {
      super();

      this.state = {
        messages : []
      };

      // binding this class to functions
      this.messagesTempate = this.messagesTempate.bind(this);
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
                  { this.messagesTempate() }
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
        $(".sendBox > form").on('submit', (e) => {
          e.preventDefault();

          // client anwser to agent
          let clientAnwser = {
            name : 'client',
            msg : 'I have a realy fucking problem!!!',
            date : new Date()
          }

          
        });
    }

    // function for rendering messages in template
    messagesTempate() {
      return this.state.messages.map((msg, index) => {
        return (
          <div className="quotas well">
            <span>
              <span> { msg.name } </span>
              <span> { msg.msg } </span>
              <span> { msg.date.toString() } </span>
            </span>
          </div>
        )
      })
    }
}

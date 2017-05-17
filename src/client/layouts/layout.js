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
                <div className="row sendBoxContainer">
                  <div className="sendBox">
                    <form>
                      <input type="text" placeholder="Write Message...."/>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )
    }

    // after that component rendered
    componentDidMount() {
        var socket = io.connect("http://localhost:8080");

        $(".sendBox form").on('submit', (e) => {
          e.preventDefault();

          // client anwser to agent
          const clientAnwser = {
            name : 'client',
            msg : 'I have a realy fucking problem!!!',
            date : new Date()
          }

          // emiting anwser from client to agent
          socket.emit('client message', clientAnwser);

          // adding new anwser to our messages state
          const prevMessages = this.state.messages;
          prevMessages.push(clientAnwser);

          // updating previous messages
          this.setState(() => {
            return { message : prevMessages}
          });
        });

        socket.on("agentMessage", (val) => {

          // adding new anwser to our messages state
          const prevMessages = this.state.messages;
          prevMessages.push(val);

          // updating previous messages
          this.setState(() => {
            return { message : prevMessages}
          });
        });
    }

    // function for rendering messages in template
    messagesTempate() {
      return this.state.messages.map((msg) => {
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

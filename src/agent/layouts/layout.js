import React from 'react';
import '../../../node_modules/socket.io-client/socket.io.js';
import $ from 'jquery';

// improt style file
import '../styles/layout.css';

export default class Layout extends React.Component {
  constructor() {
    super();

    this.state = {
      messages: []
    };

    // binding this to function
    this.messagesTemplate = this.messagesTemplate.bind(this);

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
                { this.messagesTemplate() }
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
    var socket = io.connect('http://localhost:8080');


    $(".sendBox form").on("submit", (e) => {
        e.preventDefault();

        // Agent anwser to client
        const agentMsg = {
          'name' : 'Agent',
          'msg' : $(".sendBox > form > input").val(),
          'date' : new Date()
        };

        $(".sendBox > form > input").val('');

        // sending anwser to client
        socket.emit('agent message', agentMsg);

        // saving new anwser in the messages
        const prevMessages = this.state.messages;

        prevMessages.push(agentMsg);

        this.setState(() => {
          return { messages : prevMessages};
        });

    });

    // getting self id
    socket.on('clientMessage', ( newMessage ) => {
        // saving new anwser in the messages
        const prevMessages = this.state.messages;

        prevMessages.push(newMessage);

        // saving new client message in messages
        this.setState(() => {
          return { messages : prevMessages};
        });
    });
  }


  // function for rendering messages in template
  messagesTemplate() {
    console.log("&(*&*&*&*&*)");

    return this.state.messages.map((msg) => {
        return (
          <div className="userQuota">
            <span>
              <span> { msg.name } </span>
              <span> { msg.msg } </span>
              <span> { msg.date.toString() } </span>
            </span>
          </div>
        )
    });
  }
}

import React from 'react';
import $ from 'jquery';

// import css files
import '../styles/layout.css';

// checking last message sender
// true means 'client'
let sender = true;

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
                    <div className="userDetail">
                      <span>
                        <div className='circle'></div>
                        <span>Daniel</span>
                        <span>Nasiri</span>
                      </span>
                    </div>
                    <div className="userImageContainer">
                      <div className="userImage"></div>
                    </div>
                    <div className="userJob">
                      <span>
                        <span>Technical</span><br/>
                        <span>Support</span>
                      </span>
                    </div>
                  </header>
                  <div className="chatMessagesContainer">
                    { this.messagesTempate() }
                  </div>
                </div>
                <div className="row sendBoxContainer">
                  <div className="sendBox">
                    <form>
                      <input type="text" placeholder="Write Message...."/>
                    </form>
                      <div id="sendImage"></div>
                      <div id="isTyping">
                        <span>Support is typing </span>
                        <div className='circle'></div>
                        <div className='circle'></div>
                        <div className='circle'></div>
                     </div>
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

        // sending login announcment to server
        // null can be changed to user email , name
        socket.emit('clientLogin', null);

        $(".sendBox form").on('submit', (e) => {
          e.preventDefault();

          // client anwser to agent
          let clientAnwser = {
            name : 'client',
            msg :  $(".sendBox > form > input").val(),
            date : this.renderDate(),
            sender : true
          }

          // emiting anwser from client to agent
          socket.emit('clientMessage', clientAnwser);

          // adding new anwser to our messages state
          const prevMessages = this.state.messages;

          // getting client last messagem
          let lastMsg = prevMessages[ this.state.messages.length - 1];

          if(!this.state.messages.length || !lastMsg.sender) {
            prevMessages.push(clientAnwser);

            // updating previous messages
            this.setState(() => {
              return { message : prevMessages}
            });

          } else {
            console.log("last messages", prevMessages);

            // appending new message to last message
            lastMsg.msg = lastMsg.msg + " " + clientAnwser.msg;

            console.log("last message changed " , lastMsg);
            prevMessages[ this.state.messages.length - 1 ] = lastMsg;

            // updating previos messages
            this.setState(() => {
                return { messages : prevMessages }
            });
          }

          // Making input empty
          $(".sendBox > form > input").val('');
        });


        socket.on("serverAgentMessage", (newMessage) => {
          // setting last sender to agent
          newMessage['sender'] = false;

          // adding new anwser to our messages state
          const prevMessages = this.state.messages;

          prevMessages.push(newMessage);
          console.log(prevMessages);
          // updating previous messages
          this.setState(() => {
            return { message : prevMessages }
          });
        });
    }

    // function for rendering messages in template
    messagesTempate() {
      return this.state.messages.map((data) => {
        const containerChecker = data.sender ? "leftMsgContainer" : "rightMsgContainer";
        const msgChecker = data.sender ? "leftMsg" : "rightMsg";
        return (
            <div className={ containerChecker }>
              <div className={ msgChecker }>
                <div></div>
                <span>
                  <span>{ data.date }</span>
                  <span>{ data.name }</span>
                  <span>{ data.msg }</span>
                </span>
              </div>
            </div>
        )
      })
    }

    // rendering date in specific template
    renderDate() {
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const date = new Date();
      const month = date.getMonth();
      const minutes = date.getMinutes().toString().length < 10 ? '0' + date.getMinutes().toString() : date.getMinutes();
      const hours = date.getHours();
      const pmAm = hours > 12 ? 'PM' : 'AM';
      const day = monthNames[ month ];

      return day + ' ' + hours + ':' + minutes + ' ' + pmAm ;
    }
}

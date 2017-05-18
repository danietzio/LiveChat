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
          const clientAnwser = {
            name : 'client',
            msg :  $(".sendBox > form > input").val(),
            date : this.renderDate()
          }

          // emiting anwser from client to agent
          socket.emit('clientMessage', clientAnwser);

          // adding new anwser to our messages state
          const prevMessages = this.state.messages;
          prevMessages.push(clientAnwser);

          // updating previous messages
          this.setState(() => {
            return { message : prevMessages}
          });
        });

        socket.on("serverAgentMessage", (newMessage) => {
          // adding new anwser to our messages state
          const prevMessages = this.state.messages;
          prevMessages.push(newMessage);

          // updating previous messages
          this.setState(() => {
            return { message : prevMessages }
          });
        });
    }

    // function for rendering messages in template
    messagesTempate() {
      return this.state.messages.map((msg) => {
        return (
            <div className="rightMsgContainer">
              <div className="rightMsg">
                <div></div>
                <span>
                  <span>May 10:20</span>
                  <span>Client #1431</span>
                  <span>I have a realy fucking problem!! </span>
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

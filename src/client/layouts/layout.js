import React from 'react';
import $ from 'jquery';

// import css files
import '../styles/layout.css';

// checking last message sender
// true means 'client'
let changed = false;

export default class Layout extends React.Component {
    constructor() {
      super();

      this.state = {
        messages : []
      };

      // binding this class to functions
      this.messagesTempate = this.messagesTempate.bind(this);
      this.isFirstOne = this.isFirstOne.bind(this);
      this.getHeadTemplate = this.getHeadTemplate.bind(this);
    }

    // before that component rendered
    componentWillMount() {}

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

          // adding new anwser to our messages state
          const prevMessages = this.state.messages;

          // Check that this message is head or not
          const isFirstOne = this.isFirstOne();

          // client anwser to agent
          let clientAnwser = {
            name : 'client',
            msg :  $(".sendBox > form > input").val(),
            date : this.renderDate(),
            sender : true,
            first : isFirstOne
          }

          // emiting anwser from client to agent
          socket.emit('clientMessage', clientAnwser);

          // getting client last messagem
          let lastMsg = prevMessages[ this.state.messages.length - 1];
          prevMessages.push(clientAnwser);

          // updating previous messages
          this.setState(() => {
            return { message : prevMessages}
          });

          // Making input empty
          $(".sendBox > form > input").val('');
        });


        // Messages comming from Agent
        socket.on("serverAgentMessage", (newMessage) => {
          // Check that this message is head or not
          let isFirstOne = this.isFirstOne();

          // setting last sender to agent
          newMessage['first'] = !isFirstOne;

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
      return this.state.messages.map((data) => {
        const containerChecker = data.sender ? "leftMsgContainer" : "rightMsgContainer";
        const msgChecker = data.sender ? "leftMsg" : "rightMsg";
        return (
            <div className={ containerChecker }>
              <div className={ msgChecker }>
                { this.getHeadTemplate(data) }
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

    // checking that new message is head of previous messages or not ?~?~?
    isFirstOne() {

      // adding new anwser to our messages state
      const prevMessages = this.state.messages;
      let prevMsg = prevMessages[ prevMessages.length - 1 ];

      if( !prevMessages.length || prevMsg.name != 'client') {
        return true
      } else {
        return false;
      }
    }

    // Returning head of message template
    getHeadTemplate(data) {
      if ( data.first ) {
        return ( <div></div> )
      } else {
        return '';
      }
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

import React, {Component} from 'react';
import ChannelSection from './channels/ChannelSection.jsx';
import UserSection from './users/UserSection.jsx';
import MessageSection from './messages/MessageSection.jsx';

class App extends Component {
  constructor(props) {
      super(props);
      // Set default app state
      this.state = {
        channels: [],
        users: [],
        messages: [],
        activeChannel: {},
        connected: false
      };
  }

  componentDidMount() {
    /*
     * Once compoent has rendered with empty state
     * open server connection (WebSocket)
     */
    let ws = this.ws = new WebSocket('ws://echo.websocket.org');  
  }

  // Recieve new channel added event
  newChannel(channel) {
    let {channels} = this.state;
    channels.push(channel);
    this.setState({channels});
  }

  // Adds channel to slack-clone
  addChannel(name) {
    let {channels} = this.state;
    let msg = {
      name: 'channel add',
      data: {
        id: channels.length,
        name
      }
    };
    this.ws.send(JSON.stringify(msg));
  }

  // Sets active channel in Interface for current User
  setChannel(activeChannel) {
    this.setState({activeChannel});
    // TODO: Get Channels Messages from server
  }

  // Sets the current user name
  setUserName(name) {
    let {users} = this.state;
    users.push({id: users.length, name});
    this.setState({users});
    // TODO: Send to Server
  }

  // Adds a message to a channel thread
  addMessage(body) {
    let {messages, users} = this.state;
    let createdAt = new Date;
    let author = users.length > 0 ? users[0].name : 'anonymous';
    messages.push({id: messages.length, body, createdAt, author});
    this.setState({messages});
    // TODO: Send to Server
  }

  render() {
    return(
      <div className='app'>
        <div className='nav'>
          <ChannelSection
            {...this.state}
            addChannel={this.addChannel.bind(this)}
            setChannel={this.setChannel.bind(this)}
          />
          <UserSection
            {...this.state}
            setUserName={this.setUserName.bind(this)}
          />
        </div>
        <MessageSection
          {...this.state}
          addMessage={this.addMessage.bind(this)}
        />
      </div>
    );
  }
}

export default App;

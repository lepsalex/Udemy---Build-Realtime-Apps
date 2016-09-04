import React, {Component} from 'react';
import ChannelSection from './channels/ChannelSection.jsx';
import UserSection from './users/UserSection.jsx';
import MessageSection from './messages/MessageSection.jsx';
import Socket from '../socket.js';

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

    // Init new socket class object
    let socket = this.socket = new Socket();

    // Wire up events
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
    socket.on('user add', this.onUserAdd.bind(this));
    socket.on('user edit', this.onUserEdit.bind(this));
    socket.on('user remove', this.onUserRemove.bind(this));
    socket.on('channel add', this.onChannelAdd.bind(this));
    socket.on('message add', this.onMessageAdd.bind(this));
  }

  // Connection event handler
  onConnect() {
    this.setState({connected: true});
    this.socket.emit('channel subscribe');
    this.socket.emit('user subscribe');
  }

  // Disconnection event handler
  onDisconnect() {
    this.setState({connected: false});
  }

  // Add user event handler
  onUserAdd(user) {
    let {users} = this.state;
    users.push(user);
    this.setState({users});
  }

  // Edit user event handler
  onUserEdit(editUser) {
    let {users} = this.state;
    users = users.map(user => {
      if (editUser.id === user.id) {
        return editUser;
      }
      return user;
    });
    this.setState({users});
  }

  // Remove user event handler
  onUserRemove(removeUser) {
    let {users} = this.state;
    users = users.filter(user => {
      return user.id !== removeUser.id;
    });
    this.setState({users});
  }

  // Add channel event handler
  onChannelAdd(channel) {
    let {channels} = this.state;
    channels.push(channel);
    this.setState({channels});
  }

  // Add message event handler
  onMessageAdd(message) {
    let {messages} = this.state;
    messages.push(message);
    this.setState({messages});
  }

  // Sets active channel for user to interact with
  setChannel(activeChannel) {
    // Set active channel
    this.setState({activeChannel});
    // unsubscribe from any previous subscription
    this.socket.emit('message unsubscribe');
    // clear messages in state
    this.setState({messages: []});
    // subscribe to channel
    this.socket.emit('message subscribe',
      {channelId: activeChannel.id});
  }

  // Emit set user event
  setUserName(name) {
    this.socket.emit('user edit', {name});
  }

  // Emit channel add event
  addChannel(name) {
    this.socket.emit('channel add', {name});
  }

  // Emit message add event
  addMessage(body) {
    let {activeChannel} = this.state;
    this.socket.emit('messages add',
      {channelId: activeChannel, body});
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

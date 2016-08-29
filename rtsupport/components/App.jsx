import React, {Component} from 'react';
import ChannelSection from './channels/ChannelSection.jsx';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        channels: []
      };
  }

  addChannel(name) {
    let {channels} = this.state;
    channels.push({id: channels.length, name});
    this.setState({channels});
    // TODO: Send to Server
  }

  setChannel(activeChannel) {
    this.setState({activeChannel});
    // TODO: Get Channels Messages from server
  }

  render() {
    return(
      <div>
        <ChannelSection
          channels={this.state.channels}
          addChannel={this.addChannel.bind(this)}
          setChannel={this.setChannel.bind(this)}
        />
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import config from '../config';
import Message from './Message';
import MessageBox from './MessageBox';

class MessagePanel extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: null };

    this.updateMessages = this.updateMessages.bind(this);
  }

  componentDidMount() {
    axios.request({
      method: 'get',
      url: `${config.apiEndpoint}/messages/${this.props.secondPartyId}`,
      headers: {
        'authorization': this.props.firstPartyId
      }
    })
      .then((response) => {
        this.setState({ messages: response.data });
      })
      .catch((e) => {
        console.error(e);
      })
  }

  updateMessages(messages) {
    this.setState({ messages });
  }

  render() {
    return (
      <div className="message-panel">
        {
          this.state.messages && this.state.messages.map(message =>
            <Message
              isFirstParty={message.sender_id === this.props.firstPartyId}
              text={message.message_text}
              time={message.received_time}
              key={message.message_id}
            />
          )
        }
        <hr />
        <MessageBox
          firstPartyId={this.props.firstPartyId}
          secondPartyId={this.props.secondPartyId}
          sentMessageCallback={this.updateMessages}
        />
      </div>
    )
  }
};

MessagePanel.propTypes = {
  firstPartyId: PropTypes.string.isRequired,
  secondPartyId: PropTypes.string.isRequired
}

export default MessagePanel;

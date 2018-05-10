import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import config from '../config';
import Message from './Message';

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = { messageText: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.constructDataObject = this.constructDataObject.bind(this);
  }

  constructDataObject() {
    return {
      message_text: this.state.messageText,
      receiver_id: this.props.secondPartyId
    }
  }

  sendMessage() {
    const messageObject = this.constructDataObject();
    
    axios.request({
      method: 'post',
      url: `${config.apiEndpoint}/messages/${this.props.secondPartyId}`,
      data: messageObject,
      headers: {
        'authorization': this.props.firstPartyId
      }
    })
      .then((res) => {
        /*
          In reality, this would dispatch an action in Redux, for example, which
          is a far cleaner approach than data callbacks to parent components.
        */
        this.props.sentMessageCallback(res.data);
      })
      .catch((e) => {
        console.error(e);
      })
  }

  handleChange(event) {
    this.setState({ messageText: event.target.value });
  }

  handleSubmit() {
    this.sendMessage();
  }

  render() {
    return (
      <form className="message-box">
        <input type="text" value={this.state.messageText} onChange={this.handleChange} />
        <button type="button" onClick={this.handleSubmit}>Send</button>
      </form>
    )
  }
};

MessageBox.propTypes = {
  firstPartyId: PropTypes.string.isRequired,
  secondPartyId: PropTypes.string.isRequired,
  sentMessageCallback: PropTypes.func
}

export default MessageBox;

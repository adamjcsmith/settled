/*
  This should be an interface to Postgres, where functions directly make a query
  with sanitised parameters. For this demo, we will act on an instance of static
  data instead.

  In reality, we would validate userIds first and reject junk input, and then
  validate message objects.
*/

const uuid = require('uuid');

const MESSAGE_HISTORY = require('../domain/example_message_history');
const { NOT_IMPLEMENTED } = require('../error/error');

const { sender_id, receiver_id } = MESSAGE_HISTORY[0];

// Ensure that we have a matching thread of messages, and return history.
const getMessageThread = async (firstPartyId, secondPartyId) => {
  if (firstPartyId === sender_id && secondPartyId === receiver_id) {
    return MESSAGE_HISTORY;
  }
  return [];
};

// Construct a message object and insert to domain model.
const createMessage = async (firstPartyId, secondPartyId, messageObject) => {
  if (firstPartyId === sender_id && secondPartyId === receiver_id) {
    const newMessage = Object.assign({}, {
      ...messageObject,
      sender_id: firstPartyId,
      received_time: new Date().toISOString(),
      message_id: uuid.v4()
    });
    
    MESSAGE_HISTORY.push(newMessage);
    return MESSAGE_HISTORY;
  }
  return new Error(NOT_IMPLEMENTED);
};

module.exports = {
  getMessageThread,
  createMessage
}

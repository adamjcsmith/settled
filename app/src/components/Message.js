import React from 'react';
import moment from 'moment';

const message = ({ isFirstParty, text, time }) => {
  return (
    <div className={`${isFirstParty ? 'first' : 'second'}-party message`}>
      <p><strong>{isFirstParty ? 'You' : 'Them'}</strong> <span>- {moment(time).fromNow()}</span></p>
      { text }
    </div>
  );
};

export default message;

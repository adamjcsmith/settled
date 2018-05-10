import React, { Component } from 'react';

import './styles/App.css';
import MessagePanel from './components/MessagePanel';

const BUYER_ID = '3a756c31-05c4-45a9-8b98-eb097221c786';
const SELLER_ID = '67f225e2-1fd6-45cc-87ce-b6bc305a084a';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Messaging App</h1>
        </header>
        <MessagePanel
          firstPartyId={BUYER_ID}
          secondPartyId={SELLER_ID}
        />
      </div>
    );
  }
}

export default App;

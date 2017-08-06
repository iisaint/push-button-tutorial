import React, { Component } from 'react'
import PushButton from '../build/contracts/PushButton.json'
import getWeb3 from './utils/getWeb3'
import 'bulma/css/bulma.css';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contractAddress = '0x692cfd19d181f50469f85d30b054457915f51fb1';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      pushButtonInstance: null,
      nextTimeoutBlock: 0,
      totalPush: 0,
      title: '',
      currentBlock: 0,
      mounted: false,
      end: ''
    }
  }

  componentWillMount() {

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })

    if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
    }
    this.setState({
        mounted: false
    });
  }

  componentDidMount() {
      this.startPolling();
      this.setState({
          mounted: true
      });
  }

  instantiateContract() {

    const contract = require('truffle-contract')
    const pushButton = contract(PushButton)
    pushButton.setProvider(this.state.web3.currentProvider)

    var pushButtonInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      pushButton.at(contractAddress).then((instance) => {
        pushButtonInstance = instance
        this.setState({pushButtonInstance});
        return pushButtonInstance.totalPush.call();
      }).then((result) => {
        this.setState({totalPush: this.state.web3.toDecimal(result)});
        return pushButtonInstance.nextTimeoutBlock.call();
      }).then((result) => {
        this.setState({nextTimeoutBlock: this.state.web3.toDecimal(result)});
        return pushButtonInstance.title.call();
      }).then((result) => {
        this.setState({title: result});
        return true;
      })
    })
  }

  startPolling() {
      let self = this;
      setTimeout(function () {
          if (!self.state.mounted) {
              return;
          }
          self.poll();
          self._timer = setInterval(self.poll.bind(self), 4000);
      }, 1000);
  }

  poll() {
    if (this.state.pushButtonInstance === null)
      return;

    this.state.pushButtonInstance.totalPush.call().then((result) => {
      this.setState({totalPush: this.state.web3.toDecimal(result)});
      return this.state.pushButtonInstance.nextTimeoutBlock.call();
    }).then((result) => {
      this.setState({nextTimeoutBlock: this.state.web3.toDecimal(result)});
      return this.state.pushButtonInstance.title.call();
    }).then((result) => {
      this.setState({title: result});
      return this.state.pushButtonInstance.getBlock.call();
    }).then((result) => {
      if (this.state.web3.toDecimal(result) > this.state.nextTimeoutBlock) {
        this.setState({end: "The End. You Lost!!!!!"});
      }
      return this.setState({currentBlock: this.state.web3.toDecimal(result)}); 
    });
  }

  push() {
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.pushButtonInstance.push({from: accounts[0]}).then((result) => {
        console.log(result.tx);
      }).catch((error) => {
        console.log(error);
      })
    })
  }

  render() {
    return (
      <div className="App">
        <section className="hero is-dark is-fullheight" >
            <div className="hero-body">
            <div className="container has-text-centered">
              <img src="./img/photo.jpg" onClick={this.push.bind(this)} alt="Lost"/>
              <h1 className="title" > Pushing the button every 108 minutes</h1>
              <h2>Title: {this.state.title}</h2>
              <h2>Save times: {this.state.totalPush}</h2>
              <h2>The world will be destroyed at: {this.state.nextTimeoutBlock} block</h2>
              <h2>Block is ticking: {this.state.nextTimeoutBlock - this.state.currentBlock}</h2>
              <img src="./img/btn.png" onClick={this.push.bind(this)} alt="push the button"/>
              <h1>{this.state.end}</h1>
            </div> 
            </div> 
        </section>
      </div>
    );
  }
}

export default App

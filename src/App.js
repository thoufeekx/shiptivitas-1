import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import HomeTab from './HomeTab';
import Navigation from './Navigation';
import Board from './Board';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
    };
    console.log('App started with state:', this.state);  // See initial state
  }
  renderShippingRequests() {
    return (<Board />);
  }

  // Sending this info to Navigation component through props
  renderNavigation() {
    console.log('App is passing changeTab function to Navigation');  // Added log
    return (<Navigation
      selectedTab={this.state.selectedTab}                // Passing data to navigation which tab is selected
      onClick={(tabName) => 
       {
        console.log('Navigation is calling the function App gave it');  // Added log
        this.changeTab(tabName)
        }
      }      // Gives Navigation a way to request changes, when you call onlick run my changetab
    
      />);
  }

  renderTabContent() {
    switch(this.state.selectedTab) {
      case 'home':
      default:
        return HomeTab();
      case 'shipping-requests':
        return this.renderShippingRequests();
    }
  }
  render() {
    return (
      <div className="App">
        {this.renderNavigation()}

        <div className="App-body">
          {this.renderTabContent()}
        </div>
      </div>
    );
  }

  changeTab(tabName) {
    console.log('App received request to change to:', tabName);  // See what Navigation sent
    this.setState({
      selectedTab: tabName,
      
    }, () => {
      console.log('App state is now:', this.state);  // See new state after change
    });
    
  }
}

export default App;

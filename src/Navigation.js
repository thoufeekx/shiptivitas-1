import React from 'react';

export default class Navigation extends React.Component {
  render() {
    console.log('Navigation received props:', this.props);  // See what App sent
    return (
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item">
          <a className={"nav-link " + (this.props.selectedTab === 'home' ? 'active': '')} 
          onClick={() => 
          {
            console.log('User clicked Home Tab')
            this.props.onClick("home")
          }
          
          } // Calls function recived from app(parent) => changeTab(tabName)

            id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected={this.props.selectedTab === 'home'}>Home</a>
        </li>
        <li className="nav-item">
          <a className={"nav-link " + (this.props.selectedTab === 'shipping-requests' ? 'active': '')} 
          onClick={() => 
            {
              console.log('User clicked Shipping Requests tab');  // See when user clicks
              this.props.onClick("shipping-requests")
            }
          }
          id="shipping-requests-tab" data-toggle="tab" href="#shipping-requests" role="tab" aria-controls="shipping-requests" aria-selected={this.props.selectedTab === 'shipping-requests'}>Shipping Requests</a>
        </li>
      </ul>
    );
  }
}
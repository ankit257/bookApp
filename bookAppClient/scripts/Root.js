import React, { PropTypes, Component } from 'react';
import { Router, Route } from 'react-router';

import { addons } from 'react/addons'
const ReactCSSTransitionGroup = addons.CSSTransitionGroup

import App from './App';
import RepoPage from './pages/RepoPage';
import UserPage from './pages/UserPage';
import AddBookToLibrary from './pages/AddBookToLibrary';
import AddBook from './pages/AddBook';
import NearBy from './pages/NearBy';
import Inbox from './pages/Inbox';
import Message from './pages/Message';
import Library from './pages/Library';
import User from './pages/User';
import Book from './pages/Book';



import About from './pages/About';

export default class Root extends Component{
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        <Route name='/' path='/' component={App}>
          <ReactCSSTransitionGroup transitionName="example">
            <Route name='addbook' path='/addbook' component={AddBook} />
            <Route name='addbook' path='/addbook/:id' component={AddBookToLibrary} />
            <Route name='nearby' path='/nearby' component={NearBy} />
            <Route name='inbox' path='/inbox' component={Inbox} />
            <Route name='message' path='/message/:id' component={Message} />
            <Route name='library' path='/library/:id' component={Library} />
            <Route name='book' path='/book/:id' component={Book} />
            <Route name='user' path='/user/:id' component={User} />
            <Route name='about' path='/about' component={About} />
            <Route name='repo' path='/:login/:name' component={RepoPage} />
            <Route name='user' path='/:login' component={UserPage} />
          </ReactCSSTransitionGroup>
        </Route>
      </Router>
    );
  }
}

import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import mui from 'material-ui';
const ThemeManager = new mui.Styles.ThemeManager();
const  { Slider, FlatButton, FontIcon, Dialog, Toggle } = mui;

import Loading from '../components/Loading';


import SearchPreferenceActions from '../actions/SearchPreferenceActions';

import * as SearchActionCreators from '../actions/SearchActionCreators';

import NearByBookStore from '../stores/NearByBookStore';

import connectToStores from '../utils/connectToStores';

import SelectBox from 'react-select-box';

import addons from 'react/addons'

import selectn from 'selectn';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

injectTapEventPlugin();

function parseLogin(params) {
  return params.login;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
  const { params } = props;
  // const userLogin = parseLogin(params);
  // console.log(userLogin);
  // UserActionCreators.requestUser(userLogin, ['name', 'avatarUrl']);
  // // RepoActionCreators.requestStarredReposPage(userLogin, true);
}
/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
  const user = '';

  return {
    user,
  }
}

// @connectToStores([], getState)
export default class UserPage {
  static propTypes = {
    // Injected by React Router:
    params: PropTypes.shape({
      login: PropTypes.string.isRequired
    }).isRequired,

    // Injected by @connectToStores:
    user: PropTypes.object,
    // starred: PropTypes.arrayOf(PropTypes.object).isRequired,
    // starredOwners: PropTypes.arrayOf(PropTypes.object).isRequired,
    // isLoadingStarred: PropTypes.bool.isRequired,
    // isLastPageOfStarred: PropTypes.bool.isRequired
  };

  constructor() {
    // this.renderStarredRepos = this.renderStarredRepos.bind(this);
    // this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  }

  componentWillMount() {
    // requestData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // if (parseLogin(nextProps.params) !== parseLogin(this.props.params)) {
    //   requestData(nextProps);
    // }
  }

  render() {
    const { user, params } = this.props;

    return (
      <DocumentTitle title={`Starred by ${user}`}>
        <div>
          {user ?
            <User user={user} /> :
            <h1>Loading...</h1>
          }

          <h1>Starred repos</h1>
        </div>
      </DocumentTitle>
    );
  }


  handleLoadMoreClick() {
    // const login = parseLogin(this.props.params);
    // RepoActionCreators.requestStarredReposPage(login);
  }
}

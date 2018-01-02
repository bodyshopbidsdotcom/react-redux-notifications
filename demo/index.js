import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Notification, createNotificationReducer, displayNotification, createNotification } from 'snapsheet-react-redux-notifications';

import { createStore, compose, combineReducers } from 'redux';
import classNames from 'classnames';

let composeEnhancers = compose;
if (process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}
// With initial state:
//
// const reducers = {
//   notifications: createNotificationReducer({
//     notifications: [
//       createNotification("WARNING", "You have an error from the backend on page load!"),
//       createNotification("ERROR", "You have an error from the backend on page load!", 1000)
//     ]
//   })
// };
//


const reducers = {
  notifications: createNotificationReducer()
};

const store = createStore(combineReducers(reducers), composeEnhancers());


function NotificationMessage(props) {
  const classes = classNames("notification", {
    "notification--active": props.active,
    "notification--inactive": !props.active
  });

  return (
    <div className={classes}>
      <div className="message-container">
        <h3>{props.message}</h3>
        <span>id: {props.id}</span> <span>type: {props.type}</span>
      </div>
      <button onClick={props.onDismiss} type="button">x</button>
    </div>
  );
}

NotificationMessage.propTypes = {
  active: PropTypes.bool,
  message: PropTypes.string,
  onDismiss: PropTypes.func,
  id: PropTypes.string,
  type: PropTypes.string
};


@connect((state, props) => {
  return {
    notifications: state.notifications.notifications
  };
})
class App extends Component {
  static propTypes = {
    notifications: PropTypes.array,
    dispatch: PropTypes.func
  };
  render() {
    return (
      <div>
        { this.props.notifications.map(notification => {
          return (<Notification dispatch={this.props.dispatch} key={notification.id} notification={notification} MessageComponent={NotificationMessage}/>);
        })}
        <button type="button" onClick={() => this.props.dispatch(displayNotification("ERROR", "An unexpected error occurred!",  5000))}>Trigger 5 second notification</button>
        <button type="button" onClick={() => this.props.dispatch(displayNotification("ERROR", "An unexpected error occurred!"))}>Trigger notification</button>
      </div>
    );
  }
}


ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));

# snapsheet-react-redux-notifications
[![npm version](https://badge.fury.io/js/snapsheet-react-redux-notifications.svg)](https://badge.fury.io/js/snapsheet-react-redux-notifications)

Notifications with react and redux

## Usage

### Install:
```shell
yarn add snapsheet-react-redux-notifications
```

### Add reducer

Note you can call your reducer anything, but if you want to set an initial state than you must use a `notifications` array.

```javascript
import { createNotificationReducer } from 'snapsheet-react-redux-notifications';

const rootReducer = {
  notifications: createNotificationReducer(),
  applicationReducer,
  // ...etc
};
```

With initial state:
```javascript
import { createNotificationReducer, createNotification } from 'snapsheet-react-redux-notifications';

const rootReducer = {
  notifications: createNotificationReducer({
    notifications: [
      createNotification("WARNING", "You have a warning from the backend on page load!"),
      createNotification("ERROR", "You have an error from the backend on page load!", 5000) // 5 second delay
    ]
  }),
  applicationReducer,
  // ...etc
};
```

### Create message component
Your component will be passed the following props so that you can display the flash messages however you choose.

-  active: whether or not the message is currently dismissed
-  onDismiss: a function to call to dismiss the notification
-  id,
-  message
-  type

This design enables the notification to temporarily stay in the store for a short time so that you can animate the disappearance of the message. It also makes it simple to use with existing components such as bootstrap's alert. You can use the `type` to alter the styles, and actions can trigger `onDismiss` to hide the notification.

Example:
```javascript
function NotificationMessage(props) {
  return (
    <div>
      <div>
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
```

### Display notification from the store
```javascript
import { Notification } from 'snapsheet-react-redux-notifications';


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
        {
          this.props.notifications.map(notification => {
            return (<Notification dispatch={this.props.dispatch} key={notification.id} notification={notification} MessageComponent={NotificationMessage}/>);
          })
        }
      </div>
    );
  }
}
```

### Trigger notifications
```javascript
this.props.dispatch(displayNotification("ERROR", "An unexpected error occurred!"));

this.props.dispatch(displayNotification("INFO", "An unexpected error occurred!", 10000));
```

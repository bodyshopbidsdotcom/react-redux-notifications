const NAMESPACE = "snapsheet-react-redux-notifications/notificationActions/";
const SHOW_NOTIFICATION = `${NAMESPACE}SHOW_NOTIFICATION`;
const HIDE_NOTIFICATION = `${NAMESPACE}HIDE_NOTIFICATION`;
const DESTROY_NOTIFICATION = `${NAMESPACE}DESTROY_NOTIFICATION`;

const generateId = (() => {
  let id = 0;
  return prefix => `${prefix}${++id}`;
})();

export function createNotification(type, message, duration) {
  return {
    type,
    message,
    duration,
    active: true,
    id: generateId('notification')
  };
}

export function displayNotification(type, message, duration) {
  const notification = createNotification(type, message, duration);
  return {
    type: SHOW_NOTIFICATION,
    notification
  };
}

export function dismissFlashMessage(id) {
  return {
    type: HIDE_NOTIFICATION,
    id
  };
}


export function destroyNotification(id) {
  return {
    type: DESTROY_NOTIFICATION,
    id
  };
}

const defaultInitialState = {
  notifications: []
};

export function createNotificationReducer(initialState = defaultInitialState) {
  return function reducer(state = initialState, action = {}) {
    switch (action.type) {
      case SHOW_NOTIFICATION:
        return {
          ...state,
          notifications: (state.notifications || []).concat(action.notification)
        };
      case HIDE_NOTIFICATION:
        return {
          ...state,
          notifications: (state.notifications || []).map(notification => {
            if (notification.id !== action.id) {
              return notification;
            }
            return {
              ...notification,
              active: false
            };
          })
        };
      case DESTROY_NOTIFICATION:
        return {
          ...state,
          notifications: (state.notifications || []).filter(notification => notification.id !== action.id)
        };
      default:
        return state;
    }
  };
}

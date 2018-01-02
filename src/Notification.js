import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { dismissFlashMessage, destroyNotification } from './notificationActions';

export default class Notification extends Component {
  static propTypes = {
    MessageComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    destroyDelay: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    notification: PropTypes.shape({
      active: PropTypes.bool.isRequired,
      duration: PropTypes.number,
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired
  };

  static defaultProps = {
    destroyDelay: 500
  };

  componentDidMount() {
    this.setupDismissal();
  }
  componentWillReceiveNextProps(nextProps){
    if (this.props.notification.id !== nextProps.notification.id) {
      this.setupDismissal();
    }
  }
  componentWillUnmount() {
    this.clearDismissalTimeout();
    this.clearDestroyalTimeout();
  }
  setupDismissal() {
    const { duration, active } = this.props.notification;
    if (duration && active) {
      this.dismissalTimeout = setTimeout(() => this.onDismiss(), duration);
    }
  }
  setupDestroyal() {
    const { destroyDelay } = this.props;

    this.destroyalTimeout = setTimeout(() => this.destroy(), destroyDelay);
  }
  onDismiss() {
    const { dispatch } = this.props;
    const { id, active } = this.props.notification;

    if (active) {
      this.clearDismissalTimeout();
      dispatch(dismissFlashMessage(id));
      this.setupDestroyal();
    }
  }
  destroy() {
    const { dispatch } = this.props;
    const { id } = this.props.notification;

    this.clearDestroyalTimeout();
    dispatch(destroyNotification(id));
  }
  clearDismissalTimeout() {
    if (this.dismissalTimeout) {
      clearTimeout(this.dismissalTimeout);
      this.dismissalTimeout = null;
    }
  }
  clearDestroyalTimeout() {
    if (this.destroyalTimeout) {
      clearTimeout(this.destroyalTimeout);
      this.destroyalTimeout = null;
    }
  }
  render() {
    const { MessageComponent  } = this.props;
    const { active, id, message, type } = this.props.notification;

    const componentProps = {
      active,
      onDismiss: () => this.onDismiss(),
      id,
      message,
      type
    };

    return (<MessageComponent {...componentProps} />);
  }
}

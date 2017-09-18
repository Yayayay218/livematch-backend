import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {showNotification as showNotificationAction} from 'admin-on-rest';
import {push as pushAction} from 'react-router-redux';
import {UPDATE} from 'admin-on-rest';

class ActiveButton extends Component {
    handleClick = () => {
        const {push, record, showNotification} = this.props;
        console.log(this.props);
        const updatedRecord = {...record, status: record.status == 0 ? 1 : 0};
        fetch(`/api/channels/${record.id}`,
            {
                method: 'PUT',
                body: JSON.stringify(updatedRecord),
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                }
            })
            .then(() => {
                showNotification('Channel Status Active');
                push('/channels');
                window.location.reload();
            })
            .catch((e) => {
                console.error(e);
                showNotification('Error: comment not approved', 'warning')
            });
    }

    render() {
        return (this.props.record.status == 0 ? <RaisedButton label="Activate" onClick={this.handleClick}/> :
            <RaisedButton label="Deactivate" onClick={this.handleClick}/>);
    }
}

ActiveButton.propTypes = {
    push: PropTypes.func,
    record: PropTypes.object,
    showNotification: PropTypes.func,
};

export default connect(null, {
    showNotification: showNotificationAction,
    push: pushAction,
})(ActiveButton);
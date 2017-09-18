import React from 'react';
import PropTypes from 'prop-types';

const StatusField = ({record = {}}) => {

    let status = record.status;
    if(status == 0)
        status = 'Inactive'
    if(status == 1)
        status = 'Active'
    return <span>{status}</span>
};

StatusField.PropTypes = {
    label: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired
};

export default StatusField;

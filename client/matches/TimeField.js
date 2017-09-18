import React from 'react';
import PropTypes from 'prop-types';

const TimeField = ({record = {}}) => {

  let time = record.time;

  time = parseInt(time/100) + ":" + (time % 100 ? time % 100 : '00');

  return <span>{time}</span>
};

TimeField.PropTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired
};

export default TimeField;

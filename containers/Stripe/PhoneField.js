import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

export default class PhoneField extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func,
    value: PropTypes.string
  };

  render() {
    const { handleChange, value } = this.props;
    return (
      <TextField
        id="phone"
        label="Phone number (optional)"
        type="tel"
        onChange={handleChange}
        margin="dense"
        fullWidth
        value={value}
      />
    );
  }
}

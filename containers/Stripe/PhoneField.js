import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

export default class PhoneField extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func
  };

  render() {
    const { handleChange } = this.props;
    return (
      <TextField
        id="phone"
        label="Phone number (optional)"
        type="tel"
        onChange={handleChange}
        margin="dense"
        fullWidth
      />
    );
  }
}

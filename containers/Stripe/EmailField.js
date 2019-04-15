/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

export default class EmailField extends React.Component {
  static propTypes = {
    backend_validation_errors: PropTypes.array,
    handleChange: PropTypes.func,
    isNotValid: PropTypes.func,
    value: PropTypes.string
  };

  render() {
    const {
      backend_validation_errors,
      handleChange,
      isNotValid,
      value
    } = this.props;
    return (
      <TextField
        id="email"
        label="Email address"
        type="email"
        onChange={handleChange}
        margin="dense"
        fullWidth
        required
        value={value}
        error={backend_validation_errors.some(
          err => err.param === 'additional.email'
        )}
        InputLabelProps={{ required: false }}
        helperText={isNotValid('additional.email')}
      />
    );
  }
}

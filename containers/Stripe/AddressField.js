/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

export default class AddressField extends React.Component {
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
        id="address1"
        label="Address"
        type="text"
        onChange={handleChange}
        margin="dense"
        fullWidth
        required
        value={value}
        InputLabelProps={{ required: false }}
        error={backend_validation_errors.some(
          err => err.param === 'additional.address1'
        )}
        helperText={isNotValid('additional.address1')}
      />
    );
  }
}
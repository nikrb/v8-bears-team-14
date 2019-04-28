/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

class FirstNameField extends React.Component {
  static propTypes = {
    backend_validation_errors: PropTypes.array,
    handleChange: PropTypes.func,
    isNotValid: PropTypes.func
  };

  render() {
    const { backend_validation_errors, handleChange, isNotValid } = this.props;
    return (
      <TextField
        id="first_name"
        label="First name"
        type="text"
        onChange={handleChange}
        margin="dense"
        required
        fullWidth
        InputLabelProps={{ required: false }} // to get rid of asterisk
        error={backend_validation_errors.some(
          err => err.param === 'additional.first_name'
        )}
        helperText={isNotValid('additional.first_name')}
      />
    );
  }
}

export default FirstNameField;

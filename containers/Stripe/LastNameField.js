/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

class LastNameField extends React.Component {
  static propTypes = {
    backend_validation_errors: PropTypes.array,
    handleChange: PropTypes.func,
    isNotValid: PropTypes.func
  };

  render() {
    const { backend_validation_errors, handleChange, isNotValid } = this.props;
    return (
      <TextField
        id="last_name"
        label="Last name"
        type="text"
        onChange={handleChange}
        margin="dense"
        fullWidth
        required
        error={backend_validation_errors.some(
          err => err.param === 'additional.last_name'
        )}
        InputLabelProps={{ required: false }}
        helperText={isNotValid('additional.last_name')}
      />
    );
  }
}

export default LastNameField;

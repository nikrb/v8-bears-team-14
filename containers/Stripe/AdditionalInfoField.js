import React from 'react';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core';

export default class AdditionalInfoField extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func,
    value: PropTypes.string
  };

  render() {
    const { handleChange, value } = this.props;
    return (
      <TextField
        fullWidth
        id="additional_info"
        InputLabelProps={{ required: false }}
        label="Additional information (optional)"
        margin="dense"
        multiline
        onChange={handleChange}
        placeholder="Anything else you would like to add"
        rows={4}
        type="text"
        value={value}
      />
    );
  }
}

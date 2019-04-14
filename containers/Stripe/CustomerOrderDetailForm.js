/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

import { Grid, TextField } from '@material-ui/core';

import { SelectCountry } from './Inputs';
import FirstNameField from './FirstNameField';
import LastNameField from './LastNameField';
import EmailField from './EmailField';
import PhoneField from './PhoneField';
import AddressField from './AddressField';
import CityField from './CityField';

export default class CustomerOrderDetailForm extends React.Component {
  static propTypes = {
    customerOrderDetail: PropTypes.object,
    handleChange: PropTypes.func,
    isNotValid: PropTypes.func
  };

  render() {
    const { customerOrderDetail, handleChange, isNotValid } = this.props;
    const {
      backend_validation_errors,
      city,
      country,
      first_name,
      last_name,
      email,
      phone,
      address1,
      address2
    } = customerOrderDetail;
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6}>
          <FirstNameField
            backend_validation_errors={backend_validation_errors}
            handleChange={handleChange('first_name')}
            isNotValid={isNotValid}
            value={first_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LastNameField
            backend_validation_errors={backend_validation_errors}
            handleChange={handleChange('last_name')}
            isNotValid={isNotValid}
            value={last_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EmailField
            backend_validation_errors={backend_validation_errors}
            handleChange={handleChange('email')}
            isNotValid={isNotValid}
            value={email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <PhoneField handleChange={handleChange('phone')} value={phone} />
        </Grid>
        <Grid item xs={12}>
          <AddressField
            backend_validation_errors={backend_validation_errors}
            handleChange={handleChange('address1')}
            isNotValid={isNotValid}
            value={address1}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            label="Apartment, suite, etc. (optional)"
            type="text"
            onChange={handleChange('address2')}
            margin="dense"
            fullWidth
            value={address2}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SelectCountry
            country={country}
            handleChange={handleChange('country')}
            error={backend_validation_errors.some(
              err => err.param === 'additional.country'
            )}
            helperText={isNotValid('additional.country')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CityField
            backend_validation_errors={backend_validation_errors}
            handleChange={handleChange('city')}
            isNotValid={isNotValid}
            value={city}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

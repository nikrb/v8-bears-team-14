/* eslint-disable camelcase */
import React, { Component } from 'react';
import axios from 'axios';
import {
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  CardNumberElement
} from 'react-stripe-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  withWidth,
  Typography,
  TextField,
  Paper,
  Button,
  Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import StripeElementWrapper from './StripeElementWrapper';
import { clearCart, clearBuyItNow } from '../../store/actions';
import { cartHelper } from '../../util/helpers';
import CartDrawerContent from '../../components/CartDrawer/CartDrawerContent';
import Error from '../../components/Error/Error';
import CountryPicker from './CountryPicker';
import FirstNameField from './FirstNameField';
import LastNameField from './LastNameField';
import EmailField from './EmailField';
import PhoneField from './PhoneField';
import AddressField from './AddressField';
import CityField from './CityField';

import {
  Wrapper,
  ShippmentForm,
  Cart,
  FormWrapper,
  CheckoutForm,
  CenterButton
} from '../../styles/Checkout';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  }
});

class StripeForm extends Component {
  state = {
    orderComplete: false,
    error: false,
    disable: false,
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    additional_info: '',
    country: 'GB',
    card_number: { complete: false, error: null, empty: true },
    card_expiration: {
      complete: false,
      error: null,
      empty: true
    },
    CVC_number: { complete: false, error: null, empty: true },
    zip_code: { complete: false, error: null, empty: true },
    stripe_errors: false,
    backend_validation_errors: [],
    isClient: false
  };

  componentDidMount() {
    this.setState({ isClient: true });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleStripeChange = (element, name) => {
    if (!element.empty && element.complete) {
      return this.setState({
        [name]: { complete: true, error: null, empty: false }
      });
    }

    return this.setState({
      [name]: {
        complete: false,
        empty: element.empty,
        error: element.error ? element.error.message : null
      }
    });
  };

  handleFocus = () => {
    console.log('[focus]');
  };

  handleReady = () => {
    console.log('[ready]');
  };

  isStripesInputsOk = () => {
    const { card_number, card_expiration, CVC_number, zip_code } = this.state;
    if (
      card_number.error ||
      card_expiration.error ||
      CVC_number.error ||
      zip_code.error
    ) {
      this.setState({ stripe_errors: true });
      return false;
    }
    if (
      card_number.complete &&
      card_expiration.complete &&
      CVC_number.complete &&
      zip_code.complete
    ) {
      this.setState(() => ({ stripe_errors: false }));
      return true;
    }

    // that means fields are left blank
    this.setState(() => ({ stripe_errors: true }));

    return false;
  };

  handleSubmit = ev => {
    ev.preventDefault();
    const {
      stripe,
      clearCart: clearCartRedux,
      clearBuyItNow: clearBuyItNowRedux
    } = this.props;

    if (!this.isStripesInputsOk() || this.stripe_errors) return;
    this.setState(() => ({ disable: true }));
    if (stripe) {
      const {
        first_name,
        last_name,
        address1,
        address2,
        city,
        country
      } = this.state;
      stripe
        .createToken({
          name: `${first_name} ${last_name}`,
          address_line1: address1,
          address_line2: address2,
          address_city: city,
          address_country: country
        })
        .then(payload => {
          const { email, phone, additional_info } = this.state;
          const { buyItNowItem, shippingCost, cart } = this.props;

          let purchaseDetails;
          if (Object.prototype.hasOwnProperty.call(buyItNowItem, 'name')) {
            console.log('is buyitnow pirko');
            purchaseDetails = {
              ...buyItNowItem,
              shippingCost,
              boughtFrom: 'buyItNow'
            };
          } else {
            console.log('is cart pirko');
            const selectedItems = cart;
            const totalItems = cartHelper.totalItems(cart);
            const totalPrice = cartHelper.totalPrice(cart);
            purchaseDetails = {
              selectedItems,
              totalItems,
              totalPrice,
              boughtFrom: 'cart',
              shippingCost
            };
          }
          axios
            .post('http://localhost:3000/api/charge', {
              token: payload.token.id,
              payload,
              additional: {
                email,
                first_name,
                last_name,
                phone,
                address1,
                address2,
                city,
                additional_info,
                country,
                purchaseDetails
              }
            })
            .then(res => {
              // backend did not validate form
              if (res.data.errors) {
                console.log(res.data.errors);
                console.log('terminatinu?');
                this.setState({
                  // backend_validation_errors: { ...res.data.errors },
                  backend_validation_errors: res.data.errors,
                  disable: false
                });

                return;
              }
              if (res.status === 200) {
                console.log('Purchase completed successfully');
                this.setState(() => ({ orderComplete: true }));
                // empty redux state
                clearCartRedux();
                clearBuyItNowRedux();
                console.log('its ok ', res);
              }
            })
            .catch(err => {
              console.log('its not ok ', err.response);
              console.log(err);
              console.log(err.errors);

              this.setState(() => ({ error: true }));
            });
        });
    } else {
      console.log('Form submitted before Stripe.js loaded.');
    }
  };

  isNotValid = element => {
    const { backend_validation_errors } = this.state;

    let output = null;

    if (backend_validation_errors.some(error => error.param === element)) {
      output = backend_validation_errors
        .filter(error => error.param === element)
        .map(error => error.msg);
    }
    return output;
  };

  render() {
    const {
      address1,
      card_expiration,
      card_number,
      city,
      country,
      CVC_number,
      disable,
      first_name,
      email,
      last_name,
      orderComplete,
      phone,
      stripe_errors,
      zip_code,
      backend_validation_errors,
      isClient
    } = this.state;

    const { classes, stripe, width, cart } = this.props;

    let cardNumberError = null;
    if (card_number.error) {
      cardNumberError = card_number.error;
    } else if (stripe_errors) {
      if (card_number.empty) {
        cardNumberError = `Your card's number is blank`;
      }
    }
    let postCodeError = null;
    if (zip_code.error) {
      postCodeError = zip_code.error;
    } else if (stripe_errors) {
      if (zip_code.empty) {
        postCodeError = `Your card's postal code is blank.`;
      }
    }
    let cvcError = null;
    if (CVC_number.error) {
      cvcError = CVC_number.error;
    } else if (stripe_errors) {
      if (CVC_number.empty) {
        cvcError = `Your card's security number is blank.`;
      }
    }
    let cardExpiryError = null;
    if (card_expiration.error) {
      cardExpiryError = card_expiration.error;
    } else if (stripe_errors) {
      if (card_expiration.empty) {
        cardExpiryError = `Your card's expiration day is blank.`;
      }
    }

    const purchase = orderComplete ? (
      <p>Purchase Complete.</p>
    ) : (
      <CheckoutForm>
        <Paper className={classes.paper}>
          <FormWrapper>
            <form onSubmit={e => this.handleSubmit(e)}>
              {/* invalid quantity, price or similar errors from backend */}
              {backend_validation_errors.length > 0
                ? backend_validation_errors
                    .filter(error => error.param === '_error')
                    .map((error, i) => <Error key={i}>{error.msg}</Error>)
                : null}
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <FirstNameField
                    backend_validation_errors={backend_validation_errors}
                    handleChange={this.handleChange('first_name')}
                    isNotValid={this.isNotValid}
                    value={first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LastNameField
                    backend_validation_errors={backend_validation_errors}
                    handleChange={this.handleChange('last_name')}
                    isNotValid={this.isNotValid}
                    value={last_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <EmailField
                    backend_validation_errors={backend_validation_errors}
                    handleChange={this.handleChange('email')}
                    isNotValid={this.isNotValid}
                    value={email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PhoneField
                    handleChange={this.handleChange('phone')}
                    value={phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AddressField
                    backend_validation_errors={backend_validation_errors}
                    handleChange={this.handleChange('address1')}
                    isNotValid={this.isNotValid}
                    value={address1}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="address2"
                    label="Apartment, suite, etc. (optional)"
                    type="text"
                    onChange={this.handleChange('address2')}
                    margin="dense"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CountryPicker
                    backend_validation_errors={backend_validation_errors}
                    country={country}
                    handleChange={this.handleChange('country')}
                    isNotValid={this.isNotValid}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CityField
                    backend_validation_errors={backend_validation_errors}
                    handleChange={this.handleChange('city')}
                    isNotValid={this.isNotValid}
                    value={city}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StripeElementWrapper
                    label="Card Number"
                    placeholder="1234 1234 1234 1234"
                    component={CardNumberElement}
                    name="card_number"
                    onChange={this.handleStripeChange}
                    error={cardNumberError}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StripeElementWrapper
                    label="Expiry (MM / YY)"
                    component={CardExpiryElement}
                    name="card_expiration"
                    onChange={this.handleStripeChange}
                    error={cardExpiryError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StripeElementWrapper
                    label="CVC"
                    component={CardCVCElement}
                    name="CVC_number"
                    onChange={this.handleStripeChange}
                    error={cvcError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StripeElementWrapper
                    component={PostalCodeElement}
                    error={postCodeError}
                    label="Postal / ZIP code"
                    name="zip_code"
                    onChange={this.handleStripeChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="additional_info"
                    InputLabelProps={{ required: false }}
                    label="Additional information (optional)"
                    margin="dense"
                    multiline
                    onChange={this.handleChange('additional_info')}
                    placeholder="Anything else you would like to add"
                    rows={4}
                    type="text"
                  />
                </Grid>
              </Grid>
              <br />
              <CenterButton>
                <Button
                  color="secondary"
                  disabled={!stripe || disable}
                  fullWidth={width === 'xs'}
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Buy
                </Button>
              </CenterButton>
            </form>
          </FormWrapper>
        </Paper>
      </CheckoutForm>
    );

    const { error } = this.state;
    if (error) {
      return (
        <div>
          <div>
            We cannot process your payment. Please check your payment details
            and try again.
          </div>
        </div>
      );
    }
    const { buyItNowItem } = this.props;
    const buyItNow = Object.prototype.hasOwnProperty.call(buyItNowItem, 'name');

    const checkoutPossible = buyItNow || (isClient && cart.length > 0);
    if (checkoutPossible) {
      return (
        <Wrapper>
          <Cart>
            <CartDrawerContent inForm buyItNow={buyItNow} />
          </Cart>
          <ShippmentForm>{purchase}</ShippmentForm>
        </Wrapper>
      );
    }
    if (orderComplete) {
      return <div>order complete, clear cart</div>;
    }
    return (
      <div>
        <Typography variant="body1">Your Cart is empty.</Typography>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  buyItNowItem: state.buyItNow,
  shippingCost: state.shippingCost
});

const mapDispatchToProps = dispatch => ({
  clearCart: () => dispatch(clearCart()),
  clearBuyItNow: () => dispatch(clearBuyItNow())
});

StripeForm.propTypes = {
  buyItNowItem: PropTypes.object,
  classes: PropTypes.object.isRequired,
  shippingCost: PropTypes.number,
  stripe: PropTypes.object,
  width: PropTypes.string,
  clearCart: PropTypes.func,
  clearBuyItNow: PropTypes.func,
  cart: PropTypes.array
};

export default withWidth()(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(StripeForm)
  )
);

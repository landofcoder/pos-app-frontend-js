export function validateShippingAddress(
  outletConfig,
  guestCustomerAddress,
  isGuestCustomer
) {
  // if want to improve validate address see renderShippingAddress function
  let message;
  if (isGuestCustomer) {
    const {
      first_name,
      last_name,
      street,
      post_code,
      telephone,
      country_id,
      city,
      email
    } = guestCustomerAddress;

    if (!first_name) {
      message = 'First name is required please check your shipping address';
    } else if (!last_name) {
      message = 'Last name is required please check your shipping address';
    } else if (!street) {
      message = 'Street is required please check your shipping address';
    } else if (!city) {
      message = 'City is required please check your shipping address';
    } else if (!post_code) {
      message = 'Post code is required please check your shipping address';
    } else if (!telephone) {
      message = 'Telephone is required please check your shipping address';
    } else if (!country_id) {
      message = 'Country code is required please check your shipping address';
    } else if (!email) {
      message = 'Email is required please check your shipping address';
    } else return { status: true };
  } else {
    const {
      firstname,
      lastname,
      street,
      region_id,
      post_code,
      telephone,
      country_id,
      city
    } = outletConfig;

    if (!firstname) {
      message = 'First name is required please check your shipping address';
    } else if (!lastname) {
      message = 'Last name is required please check your shipping address';
    } else if (!street) {
      message = 'Street is required please check your shipping address';
    } else if (!city) {
      message = 'City is required please check your shipping address';
    } else if (!region_id) {
      message = 'Region_id is required please check your shipping address';
    } else if (!post_code) {
      message = 'Post code is required please check your shipping address';
    } else if (!telephone) {
      message = 'Telephone is required please check your shipping address';
    } else if (!country_id) {
      message = 'Country code is required please check your shipping address';
    } else return { status: true };
  }

  return { status: false, message };
}

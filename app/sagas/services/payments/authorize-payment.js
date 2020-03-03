import { APIContracts, Constants, APIControllers } from 'authorizenet';

const apiLoginID = '93Vw9kK9Khj';
const transactionKey = '7824v9LDg9x8WuNu';

export async function authorizeMakePayment(amount, callback) {
  const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiLoginID);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  const creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber('4242424242424242');
  creditCard.setExpirationDate('0822');
  creditCard.setCardCode('999');

  const paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const orderDetails = new APIContracts.OrderType();
  orderDetails.setInvoiceNumber('INV-12345');
  orderDetails.setDescription('Product Description');

  const tax = new APIContracts.ExtendedAmountType();
  tax.setAmount('4.26');
  tax.setName('level2 tax name');
  tax.setDescription('level2 tax');

  const duty = new APIContracts.ExtendedAmountType();
  duty.setAmount('8.55');
  duty.setName('duty name');
  duty.setDescription('duty description');

  const shipping = new APIContracts.ExtendedAmountType();
  shipping.setAmount('8.55');
  shipping.setName('shipping name');
  shipping.setDescription('shipping description');

  const billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName('Ellen');
  billTo.setLastName('Johnson');
  billTo.setCompany('Souveniropolis');
  billTo.setAddress('14 Main Street');
  billTo.setCity('Pecan Springs');
  billTo.setState('TX');
  billTo.setZip('44628');
  billTo.setCountry('USA');

  const shipTo = new APIContracts.CustomerAddressType();
  shipTo.setFirstName('China');
  shipTo.setLastName('Bayles');
  shipTo.setCompany('Thyme for Tea');
  shipTo.setAddress('12 Main Street');
  shipTo.setCity('Pecan Springs');
  shipTo.setState('TX');
  shipTo.setZip('44628');
  shipTo.setCountry('USA');

  const lineItem_id1 = new APIContracts.LineItemType();
  lineItem_id1.setItemId('1');
  lineItem_id1.setName('vase');
  lineItem_id1.setDescription('cannes logo');
  lineItem_id1.setQuantity('18');
  lineItem_id1.setUnitPrice(45.0);

  const lineItem_id2 = new APIContracts.LineItemType();
  lineItem_id2.setItemId('2');
  lineItem_id2.setName('vase2');
  lineItem_id2.setDescription('cannes logo2');
  lineItem_id2.setQuantity('28');
  lineItem_id2.setUnitPrice('25.00');

  const lineItemList = [];
  lineItemList.push(lineItem_id1);
  lineItemList.push(lineItem_id2);

  const lineItems = new APIContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  const userFieldA = new APIContracts.UserField();
  userFieldA.setName('A');
  userFieldA.setValue('Aval');

  const userFieldB = new APIContracts.UserField();
  userFieldB.setName('B');
  userFieldB.setValue('Bval');

  const userFieldList = [];
  userFieldList.push(userFieldA);
  userFieldList.push(userFieldB);

  const userFields = new APIContracts.TransactionRequestType.UserFields();
  userFields.setUserField(userFieldList);

  const transactionSetting1 = new APIContracts.SettingType();
  transactionSetting1.setSettingName('duplicateWindow');
  transactionSetting1.setSettingValue('120');

  const transactionSetting2 = new APIContracts.SettingType();
  transactionSetting2.setSettingName('recurringBilling');
  transactionSetting2.setSettingValue('false');

  const transactionSettingList = [];
  transactionSettingList.push(transactionSetting1);
  transactionSettingList.push(transactionSetting2);

  const transactionSettings = new APIContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  const transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(100);

  const createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new APIControllers.CreateTransactionController(
    createRequest.getJSON()
  );

  ctrl.execute(() => {
    const apiResponse = ctrl.getResponse();
    console.log('api response:', apiResponse);
  });

  // Defaults to sandbox
  // ctrl.setEnvironment(SDKConstants.endpoint.production);

  console.log('pass payment:', amount);
}

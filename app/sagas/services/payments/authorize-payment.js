import { APIContracts, APIControllers } from 'authorizenet';
import { CANNOT_CHARGE, SUCCESS_CHARGE } from '../../../constants/payment';

const apiLoginID = '4z4jgZU2h';
const transactionKey = '6cz962BJJ6zV47t9';

export async function authorizeMakePayment(amount) {
  return new Promise(resolve => {
    const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(apiLoginID);
    merchantAuthenticationType.setTransactionKey(transactionKey);

    const creditCard = new APIContracts.CreditCardType();
    creditCard.setCardNumber('4242424242424242');
    creditCard.setExpirationDate('0822');
    creditCard.setCardCode('999');

    const paymentType = new APIContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    const transactionRequestType = new APIContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(
      APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
    );
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(amount);

    const createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    const ctrl = new APIControllers.CreateTransactionController(
      createRequest.getJSON()
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();
      if (apiResponse.messages.resultCode === 'Ok') {
        resolve(SUCCESS_CHARGE);
      } else {
        resolve(CANNOT_CHARGE);
      }
    });
  });
}

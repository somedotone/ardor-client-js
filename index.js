(function() {

  var account = require('./lib/account');
  var passPhrase = require('./lib/passphrase');
  var interface = require('./lib/interface');

  module.exports = {
    rsConvert: account.rsConvert,
    secretPhraseToPublicKey: account.secretPhraseToPublicKey,
    publicKeyToAccountId: account.publicKeyToAccountId,
    secretPhraseToAccountId: account.secretPhraseToAccountId,
    signTransactionBytes: account.signTransactionBytes,
    verifyTransactionBytes: account.verifyTransactionBytes,
    generateToken: account.generateToken,

    generatePassphrase: passPhrase.generatePassphrase,

    getTransactionBytes: interface.getTransactionBytes,
    getIgnisBalance: interface.getIgnisBalance,
    getAccountCurrentAskOrders: interface.getAccountCurrentAskOrders,
    getAccountCurrentBidOrders: interface.getAccountCurrentBidOrders,
    getAskOrders: interface.getAskOrders,
    getBidOrders: interface.getBidOrders,
    getAssetsByIssuer: interface.getAssetsByIssuer,
    getAccountAssets: interface.getAccountAssets,
    getAccountCurrencies: interface.getAccountCurrencies,
    getAccount: interface.getAccount,
    sendIgnis: interface.sendIgnis,
    transferCurrency: interface.transferCurrency,
    getAsset: interface.getAsset,
    getCurrency: interface.getCurrency,
    transferAsset: interface.transferAsset,
    getBlockchainTransactions: interface.getBlockchainTransactions,
    getUnconfirmedTransactions: interface.getUnconfirmedTransactions,
    getConstants: interface.getConstants,
    getBlockchainStatus: interface.getBlockchainStatus,
    validateToken: interface.validateToken,
    getAccountProperties : interface.getAccountProperties,
    setAccountProperty: interface.setAccountProperty,
    deleteAccountProperty: interface.deleteAccountProperty
  };

})();

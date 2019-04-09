(function() {

  var axios = require('axios');
  var qs  = require('qs');
  var account = require('./account');

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };


  function getTransactionBytes(nodeurl,query) {
    console.log(nodeurl,query);
    return axios.post(nodeurl, qs.stringify(query), config).then(function(response) {
      return response.data;
    });
  }


  //Account balance
  function getIgnisBalance(nodeurl,account){
    return axios.get(nodeurl,{
      params: {
        requestType:"getBalance",
        chain:"IGNIS",
        account:account
        }
    })
    .then(function (response) {
      return response.data;
    });
  }

  function getAccountCurrentAskOrders(nodeurl,account) {
    return axios.get(nodeurl, {
          params: {
            requestType:"getAccountCurrentAskOrders",
            chain:"IGNIS",
            account:account
            }
        })
        .then(function(response) {
          return response.data;
        });
    }

  function getAccountCurrentBidOrders(nodeurl,account) {
    return axios.get(nodeurl, {
          params: {
            requestType:"getAccountCurrentBidOrders",
            chain:"IGNIS",
            account:account
            }
        })
        .then(function(response) {
          return response.data;
        });
    }

  function getAskOrders(nodeurl,asset) {
    return axios.get(nodeurl, {
          params: {
            requestType:"getAskOrders",
            chain:"IGNIS",
            asset:asset,
            }
        })
        .then(function(response) {
          return response.data;
        });
    }


  function getBidOrders(nodeurl,asset) {
    return axios.get(nodeurl, {
          params: {
            requestType:"getBidOrders",
            chain:"IGNIS",
            asset:asset,
            }
        })
        .then(function(response) {
          return response.data;
        });
    }

  function getAssetsByIssuer(nodeurl,account) {
    return axios.get(nodeurl, {
          params: {
            requestType:"getAssetsByIssuer",
            account:account
            }
        })
        .then(function(response) {
          return response.data.assets[0];
        });
    }


  function getAccountAssets(nodeurl,account) {
    return axios.get(nodeurl, {
        params: {
          requestType:"getAccountAssets",
          includeAssetInfo:false,
          account:account
          }
      })
      .then(function(response) {
        return response.data.accountAssets;
      })
    }

  function getAccountCurrencies(nodeurl,account,currency) {
    return axios.get(nodeurl, {
        params: {
          requestType:"getAccountCurrencies",
          account:account,
          currency:currency
          }
      })
      .then(function(response) {
        return response.data;
      })
    }

  function getAccount(nodeurl,accountRs){
    return axios.get(nodeurl, {
      params: {
        requestType:"getAccount",
        account:accountRs
        }
    })
    .then(function(response) {
      return response;
    })
  }


  function sendIgnis(nodeurl, amountNQT, recipient, passPhrase, message, messagePrunable=true){
    console.log('sendIgnis()');
    const publicKey = account.secretPhraseToPublicKey(passPhrase);
    var query = {
      chain:2,
      recipient:recipient,
      amountNQT:amountNQT,
      feeNQT:-1,
      deadline:15,
      broadcast:false,
      publicKey:publicKey,
      message:message,
      messageIsPrunable:messagePrunable
    };
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    console.log('get minimumFee');
    const url_sendmoney = nodeurl+'?requestType=sendMoney';
    const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
    return axios.post(url_sendmoney, qs.stringify(query), config)
            .then(function(response) {
              query.feeNQT = response.data.minimumFeeFQT;
              query.broadcast = false;
              console.log('get transactionBytes');
              return axios.post(url_sendmoney, qs.stringify(query), config)
                  .then(function(response){
                    const signed = account.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    var txdata;
                    if (message !==""){
                      let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                      txdata = {transactionBytes:signed, prunableAttachmentJSON:txattachment};
                    }
                    else {
                      txdata = {transactionBytes:signed};
                    }
                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                          .then(function(response){
                            return response;
                          })
                  })
            });
    }


  function transferCurrency(nodeurl, currency, unitsQNT, recipient, passPhrase, message="", messagePrunable=true){
    console.log('transferCurrency()');
    const publicKey = account.secretPhraseToPublicKey(passPhrase);
    var query = {
      chain:2,
      recipient:recipient,
      currency:currency,
      unitsQNT:unitsQNT,
      feeNQT:-1,
      deadline:15,
      broadcast:false,
      publicKey:publicKey,
      message:message,
      messageIsPrunable:messagePrunable
    };
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    console.log('get minimumFee');
    const url_sendmoney = nodeurl+'?requestType=transferCurrency';
    const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
    return axios.post(url_sendmoney, qs.stringify(query), config)
            .then(function(response) {
              query.feeNQT = response.data.minimumFeeFQT;
              query.broadcast = false;
              console.log('get transactionBytes');
              return axios.post(url_sendmoney, qs.stringify(query), config)
                  .then(function(response){
                    const signed = account.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                    var txdata;
                    if (message !==""){
                      let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                      txdata = {transactionBytes:signed, prunableAttachmentJSON:txattachment};
                    }
                    else {
                      txdata = {transactionBytes:signed};
                    }
                    console.log("sending signed transaction");
                    return axios.post(url_broadcast, qs.stringify(txdata), config)
                          .then(function(response){
                            return response;
                          })
                  })
            });
    }

  function getAsset(nodeurl,asset){
    return axios.get(nodeurl, {
      params: {
        requestType:"getAsset",
        asset:asset
        }
    })
    .then(function(response) {
      return response;
    })
  }

  function getCurrency(nodeurl,currency){
    return axios.get(nodeurl, {
      params: {
        requestType:"getCurrency",
        currency:currency
        }
    })
    .then(function(response) {
      return response;
    })
  }

  function transferAsset(nodeurl,asset,quantityQNT,recipient,passPhrase,message='',messagePrunable=true) {
      console.log('transferAsset(): '+asset);
      console.log('get publicKey');
      const publicKey = account.secretPhraseToPublicKey(passPhrase);

      var query = {
        chain:2,
        recipient:recipient,
        quantityQNT:quantityQNT,
        asset:asset,
        feeNQT:-1,
        deadline:15,
        broadcast:false,
        publicKey:publicKey,
        message:message,
        messageIsPrunable:messagePrunable
      };
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      console.log('get minimumFee');
      const url_tx = nodeurl+'?requestType=transferAsset';
      const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
      return axios.post(url_tx, qs.stringify(query), config)
          .then(function(response) {
            query.feeNQT = response.data.minimumFeeFQT;
            query.broadcast = false;
            console.log('get transactionBytes');
            return axios.post(url_tx, qs.stringify(query), config)
              .then(function(response){
                const signed = account.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                var txdata;
                if (message !==""){
                  let txattachment = JSON.stringify(response.data.transactionJSON.attachment);
                  txdata = {transactionBytes:signed, prunableAttachmentJSON:txattachment};
                }
                else {
                  txdata = {transactionBytes:signed};
                }
                console.log("sending signed transaction");
                return axios.post(url_broadcast, qs.stringify(txdata), config)
                    .then(function(response){
                      return response;
                  });
            });
      });
  }

  function getBlockchainTransactions(nodeurl,chain,account,executedOnly,timestamp) {
    return axios.get(nodeurl, {
      params: {
        requestType:"getBlockchainTransactions",
        chain:chain,
        account:account,
        executedOnly:executedOnly,
        timestamp:timestamp
      }
    })
    .then(function(response) {
      return response.data;
    })
  }

  function getUnconfirmedTransactions(nodeurl,chain,account,type,subtype) {
    return axios.get(nodeurl, {
      params: {
        requestType:"getUnconfirmedTransactions",
        chain:chain,
        account:account,
        type:type,
        subtype:subtype
      }
    })
    .then(function(response) {
      return response.data;
    })
  }

  function getConstants(nodeurl){
    return axios.get(nodeurl, {
      params: {
        requestType:"getConstants"
      }
    })
    .then(function(response) {
      return response;
    })
  }


  function getBlockchainStatus(nodeurl){
    return axios.get(nodeurl, {
      params: {
        requestType:"getBlockchainStatus"
        }
    })
    .then(function(response) {
      return response;
    });
  }


  function validateToken(nodeurl, data, token){
    return axios.get(nodeurl, {
      params: {
        requestType: "decodeToken",
        website: data,
        token: token
        }
    })
    .then(function(response) {
      return response;
    });
  }


  function getAccountProperties(nodeurl, recipient, setter){
    let params = {
      requestType: "getAccountProperties"
    }
    if(recipient) params.recipient = recipient;
    if(setter) params.setter = setter;

    return axios.get(nodeurl, { params })
    .then(function(response) {
      return response;
    });
  }


  function setAccountProperty(nodeurl, passPhrase, property, value, recipient) {
    console.log('setAccountProperty(): ' + property);
    console.log('get publicKey');
    const publicKey = account.secretPhraseToPublicKey(passPhrase);

    var query = {
      chain:2,
      recipient:recipient,
      property: property,
      value: value,
      feeNQT:-1,
      deadline:15,
      broadcast:false,
      publicKey:publicKey,
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    console.log('get minimumFee');
    const url_tx = nodeurl+'?requestType=setAccountProperty';
    const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
    return axios.post(url_tx, qs.stringify(query), config)
        .then(function(response) {
          query.feeNQT = response.data.minimumFeeFQT;
          query.broadcast = false;
          console.log('get transactionBytes');
          return axios.post(url_tx, qs.stringify(query), config)
            .then(function(response){
              const signed = account.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
              var txdata = {transactionBytes:signed};
              console.log("sending signed transaction");
              return axios.post(url_broadcast, qs.stringify(txdata), config)
                  .then(function(response){
                    return response;
                });
          });
    });
  }

  function deleteAccountProperty(nodeurl, passPhrase, property, recipient, setter) {
      console.log('setAccountProperty(): ' + property);
      console.log('get publicKey');
      const publicKey = account.secretPhraseToPublicKey(passPhrase);
  
      var query = {
        chain:2,
        property: property,
        feeNQT:-1,
        deadline:15,
        broadcast:false,
        publicKey:publicKey,
      };
      if(recipient) query.recipient = recipient;
      if(setter) query.setter = setter;

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      console.log('get minimumFee');
      const url_tx = nodeurl+'?requestType=deleteAccountProperty';
      const url_broadcast = nodeurl+'?requestType=broadcastTransaction';
      return axios.post(url_tx, qs.stringify(query), config)
          .then(function(response) {
            query.feeNQT = response.data.minimumFeeFQT;
            query.broadcast = false;
            console.log('get transactionBytes');
            return axios.post(url_tx, qs.stringify(query), config)
              .then(function(response){
                const signed = account.signTransactionBytes(response.data.unsignedTransactionBytes, passPhrase);
                var txdata = {transactionBytes:signed};
                console.log("sending signed transaction");
                return axios.post(url_broadcast, qs.stringify(txdata), config)
                    .then(function(response){
                      return response;
                  });
            });
      });
  }


  module.exports = {
    getTransactionBytes: getTransactionBytes,
    getIgnisBalance: getIgnisBalance,
    getAccountCurrentAskOrders: getAccountCurrentAskOrders,
    getAccountCurrentBidOrders: getAccountCurrentBidOrders,
    getAskOrders: getAskOrders,
    getBidOrders: getBidOrders,
    getAssetsByIssuer: getAssetsByIssuer,
    getAccountAssets: getAccountAssets,
    getAccountCurrencies: getAccountCurrencies,
    getAccount: getAccount,
    sendIgnis: sendIgnis,
    transferCurrency: transferCurrency,
    getAsset: getAsset,
    getCurrency: getCurrency,
    transferAsset: transferAsset,
    getBlockchainTransactions: getBlockchainTransactions,
    getUnconfirmedTransactions: getUnconfirmedTransactions,
    getConstants: getConstants,
    getBlockchainStatus: getBlockchainStatus,
    validateToken: validateToken,
    getAccountProperties: getAccountProperties,
    setAccountProperty: setAccountProperty,
    deleteAccountProperty: deleteAccountProperty
  };

})();
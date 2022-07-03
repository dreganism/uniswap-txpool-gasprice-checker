var dotenv = require("dotenv").config({
  path: ".env"
})

var argv = require('minimist')(process.argv.slice(2));

var log = require('console-log-level')({
  level: "DEBUG"
})

var async = require("async");
var web3 = require("web3");

const {
  JsonRpc
} = require("node-jsonrpc-client");

const Font = require('ascii-art-font');
Font.fontPath = 'fonts/';

var alreadyProcessing = false

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isEmpty(str) {
  return (!str || str.length === 0);
}

function callWithTimeout(callback, timeoutInMillis) {
  return Promise.race([
    callback,
    new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject("Timed out.");
      }, timeoutInMillis);
    }).catch((error) => {
      // log.error("error: " + error)
    })
  ]);
}

function getPriceInGwei(price) {
  return web3.utils.fromWei(price.toString(), 'gwei');
}

function getEarlierAccountNonce(client, txFrom, currentNonce) {
  return new Promise(function(resolve, reject) {
    var earlierNonce = currentNonce;

    callWithTimeout(
    // XXX old method
    // client.call("zmk_txpool_search", [{
    //    "from": txFrom
    //  }])
    client.call("zmk_txpool_query", ["'from' = '" + txFrom + "'"])
      .then((callResult) => {
        // log.info("callResult2" + callResult)
        if (callResult) {
          let txItems = callResult.pending
          if (txItems != null) {
            for (const fromKey in txItems) {
              const tx = txItems[fromKey]
              if (tx.nonce !== undefined && tx.nonce <= earlierNonce) {
                earlierNonce = tx.nonce
              }
            }
            resolve(earlierNonce)
          }
        }
      }) , 15000)
      .catch((error) => {
        reject(error)
      })
  });

}


const doWork = async (startTime) => {

  const client = new JsonRpc(process.env.ZMOK_FR_PROVIDER_URL);

  while (true) {

    if (alreadyProcessing) {
      // log.debug("already processing, skip...")
      await sleep(1000);
      continue;
    }
    alreadyProcessing = true;

    callWithTimeout(
    // XXX old method
    // client.call("zmk_txpool_search", [{
    //    "to": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    //    "input": "0x5ae401dc*",
    //    "value": "0x0"
    //  }])
    client.call("zmk_txpool_query", ["('to' = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' AND 'input' LIKE '0x5ae401dc%' AND 'value' = '0x0')"])
        .then(async (callResult) => {
        if (callResult) {
          // log.info(callResult)
          let txItems = callResult.pending
          var maxGasPrice = 0;
          var maxGasPriceTxHash = -1
          var eanPromises = []
          if (txItems != null) {
            for (const fromKey in txItems) {
              const tx = txItems[fromKey]
              // log.info(tx)
              var eanPromise = getEarlierAccountNonce(client, tx.from, tx.nonce).then((earlierAccountNonce) => {
                var skipProcessing = (tx.nonce > earlierAccountNonce)

                log.debug("tx: " + tx.hash + ", from: " + tx.from + ", gas price: " + (tx.gasPrice != undefined ? getPriceInGwei(tx.gasPrice) + " gwei" : "undefined") +
                  (skipProcessing ? " -> skip, lower nonce found" : ""));

                if (tx.gasPrice !== undefined && tx.nonce == earlierAccountNonce && BigInt(tx.gasPrice) > BigInt(maxGasPrice)) {
                  maxGasPrice = tx.gasPrice
                  maxGasPriceTxHash = tx.hash
                }
              }).catch((error) => {
                // log.error("error: " + error.message)
              });
              eanPromises.push(eanPromise)
            }
          }

          let calls = await Promise.allSettled(eanPromises).then(() => {
            // log.debug("... all calls finished...")
            Font.create("" + getPriceInGwei(maxGasPrice) + " gwei", 'Doom', function(err, rendered) {
              log.info(rendered);
              log.info("Max. gas price: " + getPriceInGwei(maxGasPrice) + " gwei, tx: " + maxGasPriceTxHash)
            });
            alreadyProcessing = false;
          }).catch((error) => {
            log.error("error: " + error.message)
          })
        }
      })
      .catch((error) => {
        log.error("error: " + error.message);
        alreadyProcessing = false;
      }), 15000)
    log.info("#######################################################################")
  }
}

const start = async () => {
  log.info("Uniswap Tx-pool gas price checker started...");
  doWork(Date.now());
}

module.exports = {
   start: start
}

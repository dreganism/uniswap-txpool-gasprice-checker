# Uniswap Tx-pool gas price checker
Sample usage of ZMOK global Tx mempool

# Analysis
This project is designed to monitor the transaction pool's gas prices on the Ethereum network to assist users in determining optimal gas prices for their transactions.

## Install dependencies
Execute command:

```shell
npm i
```

## Setting up the environment
To run this sample project, make sure you have set the correct API key for the endpoint in your .env file. Execute the following command:

```shell
cat <<EOT >> .env
ZMOK_FR_PROVIDER_URL=https://api.zmok.io/fr/<ZMOK_APP_ID>
EOT
```

## Tp Run the Gasprice Checker
```shell
npm start
```
Sample result:

```
$ npm start
Uniswap Tx-pool gas price checker started...
###############################################################################################################################################################
tx: 0x850fbbcaa288b1dc5b466b4f5ccad50bbc8639f849420e04ac51d555fd0fad22, from: 0xc14fe4fa20316dff93811b3097dc4a4def04cd0c, gas price: 5 gwei
tx: 0xede918f54096f8fd206fd54eaf91baaabca87f5561b0626198130917a9d0b94e, from: 0x91ec9d14f2489c4d4b161c8a5fb6bc98b6a0e0be, gas price: 4.378 gwei
tx: 0x5757a1960216127cebc271b97ee415b206017d16f3085f7744bf33827ff75873, from: 0x58d8ebb0d378508d927467e55a7ec915b316f7d5, gas price: 8 gwei
  -           -        -        -       -       -      -      -      -      -       -      -      -       -       -       -       -      -
  -           -        -        -       -       -      -      -      -      -       -      -      -       -       -       -       -      -
  -           -        -        -       -       -      -      -      -      -       -      -      -       -       -       -       -      -
tx: 0x747bfa7952bece18898c0b80b610ce206bb20df58f16f21c261a14d035682ce6, from: 0x8a7d01cadc1b20d16bb354354eaf8c9e1c6e5a45, gas price: 6 gwei
tx: 0x40a88c040e922d148265c9c5ed281a61b225fa7d47a69cf8005a463a257a692f, from: 0x9c115dca67582821123df60d49106a4df4ec5bdc, gas price: 161.311449919 gwei
...
... all calls finished...

Max. gas price: 227.875470382 gwei, tx: 0x39a8bc4e837e988f63187eb6a98a44fd5ef21ab3ea442a014945492a06abe3cd
###############################################################################################################################################################

```
# Analysis

### Analysis of `main.js`:

The `main.js` file includes various Node.js modules for its operation, including:
- **dotenv**: For loading environment variables from a `.env` file.
- **minimist**: For parsing command-line arguments.
- **console-log-level**: For logging purposes, with specified debug level.
- **async**: For asynchronous operations.
- **web3**: For interacting with the Ethereum blockchain.
- **node-jsonrpc-client**: Likely for making JSON-RPC calls to an Ethereum node.
- **ascii-art-font**: For generating ASCII art, possibly for console output.

The script defines several utility functions like `sleep`, `isEmpty`, `callWithTimeout`, and `getPriceInGwei`, indicating operations such as pausing execution, checking for empty strings, handling timeouts, and converting Wei to Gwei (units of Ethereum gas price), respectively.

The main functionality (`doWork` function) seems to involve querying the transaction pool for transactions meeting specific criteria (e.g., transactions to a certain address with a specific input pattern and no Ether value) and finding the one with the maximum gas price. It then logs this information in an ASCII art format.

### Analysis of `package-lock.json` (Partial Content):

The `package-lock.json` snippet provides information on the dependencies of the project. It confirms the usage of the modules mentioned in `main.js` and details their versions, along with the versions of their sub-dependencies. Notably, the project uses:
- **Various crypto modules** like `crypto-browserify` for cryptography operations in a browser-compatible way.
- **axios** and related plugins for making HTTP requests.
- **eslint** and related plugins for code linting.
- **ethers**, **web3**, and other blockchain-related modules for Ethereum blockchain interactions.

The dependency tree ensures compatibility with Ethereum blockchain operations, JSON-RPC communications, and environmental configurability, alongside standard operational needs like logging and command-line interaction.

Given the content and context of these files, it's clear the project is aimed at developers or users interested in Ethereum blockchain transactions, specifically in optimizing or analyzing gas prices for transactions in the transaction pool.

# QUICK AND EASY User Guide
If you simply want to use the website, you can access the production version at http://blockbeats.s3-website-ap-southeast-2.amazonaws.com/.

You will need to have metamask installed. With metamask installed, which your metamask to the Rinkeby Network, the page should now load properly.

You will need some Rinkeby tokens to use some page functionality, follow the steps in the Manual Guide - **section 5.2**

# MANUAL User Install and Usage Guide
## 1. Run reactapp locally
Blockbeats frontend is built as a React app. To run this app, do the following:
* Navigate to client directory `cd client`
* Install dependencies `npm install`
* Launch local website `npm start`
  * This should run the site on `localhost:3000`

*Note: the website may throw errors until the next steps are complete*

## 2. Launch truffle network and compile contracts
Blockbeats uses truffle to run contracts locally and compile them into ABIs that are used by the reactapp
* install truffle: `npm install -g truffle`
* start truffle server from local root directory: `truffle develop`
* inside this truffle console, compile/deploy contracts to local truffle network: `truffle deploy`
* You should now have compile contract JSON files in `client/src/contracts`

## 3. Configure MetaMask for truffle
* if you haven't already, install the metamask plugin to your browser of choice.
* with your truffle server running - configure your metamask to add the truffle local network as a network option:
  *  Click Custom RPC in your metamask networks
     * The RPC URL should be `http://localhost:8545`
     * The token ID should be 1337
     * Network name whatever you choose
  * Now switch to the network in your metamask network selection drop down

After doing this, you should be able to run the website and play around.

You will need to import an account that 

## 4. Configure ABIs for other networks (MATIC/Rinkeby)
Blockbeats has also deployed onto MATIC and Rinkeby. In order for your local react app to recognise these contracts addresses, they need to be added as networks.
* update your ABIs networks by running `python updateNetworks.py` from the root directory.

After doing this, your reactapp should be capable of fetching the contract from Rinkeby and MATIC.

Just open the site and switch your metamask network to rinkeby or matic. If you havent added matic to metamask, [see guide here](https://docs.matic.network/docs/develop/metamask/config-matic/)

## 5. Getting funds for testing
To actually interact with the app, you'll need some tokens
### 5.1. Truffle Net
if you're using the website with the contract running on truffle network, you can import an account your metamask. when you ran truffle develop, the console should have printed some private keys, import any of these keys to metamask and you'll have 100ETH to play with.
### 5.2. Rinkeby 
Rinkeby is a public testnet with controlled eth supply. To get tokens on rinkeby, you need to use a faucet or have some sent to you. we recommend https://faucet.rinkeby.io/ - just follow the guide.
### 5.3. Matic
Matic is a real production blockchain, funds need to be bought from an exchange and sent to your matic address.
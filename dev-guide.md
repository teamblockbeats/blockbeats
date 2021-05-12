# Local Installation
## Node
* in the client directory, install node dependencies, `npm install`. 
* to run a local version of the website, `npm start`

## Truffle
truffle is used to compile smart contracts and run a local simulated ETH network.
### First time installation
`npm install -g truffle`

### Start the network
`truffle develop` in the root project directory

this will return some account addresses and private keys, these can be imported into your metamask wallet if you need some simulated ETH for contract interactions.

### Configure your metamask
To connect your browser/metamask plugin with your local truffle network, metamask can be configured to connect to your truffle network (required to view the site). 

* Click Custom RPC in your metamask networks
  * The RPC URL should be `http://localhost:8545`
  * The token ID should be 1337
  * Network name whatever you choose

You probably will also want to import one of the truffle wallets with 100ETH in it. to do this, click import account on metamask and paste in any of the private keys that truffle outputs when you boot up `truffle console`. If you're on the network, you should see this account has 100ETH or so.

### Deploying contracts
When in the truffle develop console, run `truffle deploy`. This should compile and push the contract to the trufflenet. The contract address should be spat out.

### Testing deployed contracts on remix
A great way to test a truffle deployed contract is to use remix.ethereum.org. 
* Create a new file on their browser IDE
* Paste in the contract code that you deployed
* Click on the "deploy and run transaction" tab
* Change the environment to "injected web3" and accept the metamask connection, ensure your metamask network is truffle.
* Select your contract in the contract drop down
* Paste in the address of your deployed contract in the text field next to the "at address" button and then click the button
* A deployed contract should appear in the list below, expand this contract item
* You SHOULD be able to interact with your deployed contract using this interactive interface. 
  * To interact, you probably will need some ETH (see **configure your metamask** ^)

# AWS Serverless Deployment
Whilst the site doesn't have a need for a database (or django entirely), we can deploy to AWS - [available here](http://blockbeats.s3-website-ap-southeast-2.amazonaws.com/).

* Firstly install AWS CLI - [guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
* run `aws configure`
  * enter your access ID and key (message George if you need one)
  * ensure region name is `ap-southeast-2`
  * other settings leave blank
* when you wish to deploy, in the client directory, run `npm run deploy`

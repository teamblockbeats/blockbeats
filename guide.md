# Local Installation
## Node
Firstly update **node dependencies** and **build** the project to compile the static HTML webpage:
* `cd client`
* `npm install`
* `npm run build`

*Note that if you're only testing UI/react changes, you can simply leave npms test server running rather than having to build and restart django to see each UI change. This is done with:* `npm start`

## Django
### First time set up
The django is run through a python `virtual environment`.

* Firstly install `virtualenv`: (`pip install virtualenv`)
* Create your virtualenv called "venv" from the base directory: `virtualenv venv`

### Running the server
To run server first enter the virtualenv: 
* on mac/unix: `source venv/bin/activate`

If you have just pulled a new version of the project, there might be new python dependencies to install: `pip install -r requirements.txt`

After you've built the node static, the local server can be ran:
* `cd server`
* `python manage.py runserver`

**??TODO: database migration steps??**

## Truffle
truffle is used to compile smart contracts and run a local simulated ETH network.
### First time installation
`npm install -g truffle`

### Start the network
`truffle develop`

this will return some account addresses and private keys, these can be imported into your metamask wallet if you need some simulated ETH for contract interactions.

### Configure your metamask
Until we deploy on a real network, metamask can be configured to connect to your truffle network (required to view the site). 

* Click Custom RPC in your metamask networks
  * The RPC URL should be `http://localhost:8545`
  * The token ID should be 1337
  * Network name whatever you choose

**??TODO: deploying contracts??**


# AWS Serverless Deployment
Whilst the site doesn't have a need for a database (or django entirely), we can deploy to AWS - [available here](http://blockbeats.s3-website-ap-southeast-2.amazonaws.com/).

* Firstly install AWS CLI - [guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
* run `aws configure`
  * enter your access ID and key (message George if you need one)
  * ensure region name is `ap-southeast-2`
  * other settings leave blank
* when you wish to deploy, in the client directory, run `npm run deploy`
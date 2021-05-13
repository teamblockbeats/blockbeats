import json
from collections import OrderedDict

#   A python script to quickly update BlockBeats.json generated
#   by truffle to include references to other networks contracts
#   (e.g. rinkeby or matic).

#### USAGE #####
#   If you've deployed or redeployed on an external network -
#   Update the info in the 'networks' object below and run this
#   file AFTER your Blockbeats.json file has been generated/updated
#   by truffle.

#   If you're just wanting to use the most recent contract on one
#   of the networks, just run this file to update your Blockbeats.json
###############

# ADD / UPDATE NETWORKS BELOW
networks = [
    {"networkId": "4",  # RINKEBY (OFFICIAL)
     "address": "0xfFe7B7A97fa54f6FbDD3283CD2F53B2fd7AA4F1e",
     "transactionHash": "0xccf63836d379656d3b40a8a743e3c3ac139e47dea2cdcf6d41b5a09d48985f12"
     },
    # {"networkId": "4",  # RINKEBY (UNOFFICIAL)
    #  "address": "0x799dfa2c0f28f566a70be10ad3b4227348743190",
    #  "transactionHash": "0xdd1e80299add61b9282e2caf5c01cf3a9060f0c32b0d0a79b3481234e3d9df8f"
    #  },
    {"networkId": "137",   # MATIC
     "address": "0x97c73dB41BFbF2B8c3d1Ea2f3C1193ae429a9226",
     "transactionHash": "0x8403cba6e969edd1badfe73889e112863c99da9bde344d549493c944c2ba4d39"

     },
    {"networkId": "69",  # EXAMPLE
     "address": "0x123abc42069JustATest123123123",
     "transactionHash": "0x123abc42069JustATest42042042042069"
     }
]

abiFile = open("client/src/contracts/Blockbeats.json", "r")

abiJSON = json.loads(abiFile.read(), object_pairs_hook=OrderedDict)

abiNetworks = abiJSON["networks"]

for network in networks:
    networkId = network["networkId"]
    if (abiNetworks.get(networkId)):
        print("updating existing network: " + networkId)
        abiNetworks[networkId]["address"] = network["address"]
        abiNetworks[networkId]["transactionHash"] = network["transactionHash"]
    else:
        print("creating new network entry: " + networkId)
        newNetwork = dict()
        newNetwork["events"] = {}
        newNetwork["links"] = {}
        newNetwork["address"] = network["address"]
        newNetwork["transactionHash"] = network["transactionHash"]

        abiNetworks[networkId] = newNetwork

abiJSON["networks"] = abiNetworks

abiFile.close()

abiFile = open("client/src/contracts/Blockbeats.json", "w")

abiFile.write(json.dumps(abiJSON, indent=2, separators=(',', ': ')))

abiFile.close()

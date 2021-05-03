import json
from collections import OrderedDict

#   A python script to quickly update BlockBeats.json generated
#   by truffle to include references to other networks contracts
#   (e.g. rinkeby or matic). Update the info in the 'networks'
#   object below and run this file AFTER your Blockbeats.json
#   file has been generated/updated by truffle.

# ADD / UPDATE NETWORKS BELOW
networks = [
    {"networkId": "4",  # RINKEBY
     "address": "0x799dfa2c0f28f566a70be10ad3b4227348743190",
     "transactionHash": "0xdd1e80299add61b9282e2caf5c01cf3a9060f0c32b0d0a79b3481234e3d9df8f"
     },
    {"networkId": "69", # EXAMPLE
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

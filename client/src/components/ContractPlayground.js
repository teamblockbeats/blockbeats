import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, CircularProgress, Box } from "@material-ui/core";
import Web3 from "web3";
import BlockBeats from "../contracts/Blockbeats.json";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { pinFileToIPFS, pinListingToIPFS } from "./pinataAPI";
import ReactAudioPlayer from "react-audio-player";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
  paperTitle: {
    textAlign: "center",
    fontSize: "1.5em",
    paddingBottom: "15px",
    variant: "h5",
  },
}));

const ContractPlayground = () => {
  const classes = useStyles();

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [invalidNetwork, setInvalidNetWork] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);

  const [title, setTitle] = useState(null);
  const [URI, setURI] = useState(null);
  const [price, setPrice] = useState(null);

  const [buyingID, setBuyingID] = useState(null);

  const [myLicenses, setMyLicenses] = useState([]);

  const [titleToPin, setTitleToPin] = useState("null");
  const [descriptionToPin, setDescriptionToPin] = useState("null");
  const [musicFileToPin, setMusicFileToPin] = useState(null);
  const [imageFileToPin, setImageFileToPin] = useState(null);
  const [listingIPFSUrlResult, setlistingIPFSUrlResult] = useState("null");
  const [uploadPending, setUploadPending] = useState(false);

  const [IPFSToResolve, setIPFSToResolve] = useState(null);
  const [resolvedTitle, setResolvedTitle] = useState(null);
  const [resolvedDesc, setResolvedDesc] = useState(null);
  const [resolvedMusic, setResolvedMusic] = useState(null);
  const [resolvedImage, setResolvedImage] = useState(null);

  const rootIPFSGateway = "https://ipfs.io/ipfs/"

  /******************* BOOTSTRAPPING *****************/
  useEffect(() => {
    if (!window.web3) {
      setInvalidNetWork(true);
    } else {
      loadWeb3();
      loadBlockChainData();
    }
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
  };

  const loadBlockChainData = async () => {
    const web3 = window.web3;

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    // Check correct network
    const networkId = await web3.eth.net.getId();
    if (networkId !== 5777 && networkId !== 4) {
      setInvalidNetWork(true);
      setLoading(false);
    } else {
      const deployedNetwork = BlockBeats.networks[networkId];
      const instance = new web3.eth.Contract(
        BlockBeats.abi,
        deployedNetwork.address
      );
      setContract(instance);
      setLoading(false);
    }
  };
  /******************************************************/

  /******************** CREATE LISTING **********************/
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleURIChange = (event) => {
    setURI(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(Number(event.target.value));
  };

  const drawListingInputFields = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          placeholder="Enter title..."
          variant="outlined"
          onChange={(e) => handleTitleChange(e)}
        />
        <TextField
          placeholder="Enter URI..."
          variant="outlined"
          onChange={(e) => handleURIChange(e)}
        />
        <TextField
          placeholder="Enter Price (WEI)..."
          variant="outlined"
          onChange={(e) => handlePriceChange(e)}
        />
      </FormControl>
    );
  };

  const handleCreateListing = async () => {
    console.log("create listing");
    let result = await contract.methods
      .createListing(title, price, URI)
      .send({ from: account });
    console.log(result);
  };
  /******************************************************/

  /****************** VIEW LISTINGS *********************/
  const handleViewListings = async () => {
    console.log("view listings");
    const listingsRet = await contract.methods.viewListings().call();
    console.log(listingsRet);
    setListings(listingsRet);
  };
  /******************************************************/

  /***************** BUY LICENSE ********************/
  const handleBuyIDChange = (event) => {
    setBuyingID(Number(event.target.value));
  };

  const handleBuyListing = async () => {
    console.log("buy listing " + buyingID.toString());
    let listingPrice = getPriceOfListing(buyingID);
    await contract.methods
      .buyListing(buyingID)
      .send({ from: account, value: listingPrice });
  };

  const getPriceOfListing = (id) => {
    return Number(
      listings.filter((item) => Number(item["id"]) === id)[0]["price"]
    );
  };

  /******************************************************/

  /************** VIEW LICENSES *******************/

  const handleGetLicenses = async () => {
    console.log("get license");
    let tokenIds = await contract.methods
      .tokensAtAddress(account)
      .call({ from: account });
    let licenses = [];
    for (const tokenId of tokenIds) {
      console.log(tokenId);
      let license = await contract.methods
        .resolveTokenToListing(tokenId)
        .call({ from: account });
      license["tokenId"] = tokenId;
      licenses.push(license);
    }
    setMyLicenses(licenses);
  };

  /******************************************************/

  /************** IPFS UPLOAD ***********************/

  const handleIPFSTitleChange = (e) => {
    setTitleToPin(e.target.value);
  };
  const handleIPFSDescriptionChange = (e) => {
    setDescriptionToPin(e.target.value);
  };

  const handleIPFSMusicFileChange = (e) => {
    console.log(e.target.files);
    setMusicFileToPin(e.target.files[0]);
  };

  const handleIPFSImageFileChange = (e) => {
    console.log(e.target.files);
    setImageFileToPin(e.target.files[0]);
  };

  const onUploadSuccess = (ipfsUrl) => {
    console.log("uploadsuccess");
    setlistingIPFSUrlResult(ipfsUrl);
    setUploadPending(false);
  };

  const handleUploadIPFS = async () => {
    setUploadPending(true);
    let apiKey = "2a7bbddb5e255f5539ee";
    let apiSecretKey =
      "e0672966a87e1a831754cc3fffb846b9d40d4a6522553a55300b2f1f6a2ca477";

    let resultPost = pinListingToIPFS(
      apiKey,
      apiSecretKey,
      musicFileToPin,
      imageFileToPin,
      titleToPin,
      descriptionToPin,
      null,
      onUploadSuccess
    );
  };

  const drawUploadIPFSPaper = () => {
    if (uploadPending) {
      return (
        <Paper elevation={3} className={classes.paper}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyItems="center"
          >
            <CircularProgress style={{ margin: "auto" }} />
            <Typography>Uploading to IPFS...</Typography>
          </Box>
        </Paper>
      );
    }
    // else
    return (
      <Paper elevation={3} className={classes.paper}>
        <Typography className={classes.paperTitle}>Upload to IPFS</Typography>
        <FormControl fullWidth style={{ marginBottom: 12 }}>
          <TextField
            placeholder="Enter title..."
            variant="outlined"
            onChange={(e) => handleIPFSTitleChange(e)} // todo
          />
          <TextField
            placeholder="Enter description..."
            variant="outlined"
            onChange={(e) => handleIPFSDescriptionChange(e)}
          />
          Upload Sample
          <TextField
            name="upload-music"
            placeholder="Upload Music"
            type="file"
            onChange={(e) => handleIPFSMusicFileChange(e)}
          />
          Upload Art Work
          <TextField
            name="upload-asset"
            placeholder="Upload Music"
            type="file"
            onChange={(e) => handleIPFSImageFileChange(e)}
          />
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          onClick={handleUploadIPFS}
          color="primary"
          style={{ color: "white" }}
        >
          Upload
        </Button>

        <Typography>
          <b>IPFS URL Result: </b>
          {listingIPFSUrlResult}
        </Typography>
      </Paper>
    );
  };
  /******************************************************/

  /*************** RESOLVE IPFS *********************/
  const handleIPFSHashResolveChange = (e) => {
    setIPFSToResolve(e.target.value);
  };
  
  const removePrefix = (str, prefix) => {
    if (str.startsWith(prefix)) {
      return str.slice(prefix.length)
    } else {
      return str
    }
  }

  const handleResolveIPFS = () => {
    let jsonUrl = rootIPFSGateway + (removePrefix(IPFSToResolve, "ipfs://"))
    axios.get(jsonUrl)
      .then(function(response) {
        setResolvedTitle(response.data.name)
        setResolvedDesc(response.data.description)
        setResolvedImage(rootIPFSGateway + removePrefix(response.data.image, "ipfs://"))
        setResolvedMusic(rootIPFSGateway + removePrefix(response.data.animation_url, "ipfs://"))
      })
  };

  const drawIPFSResolvePaper = () => {
    return (
      <Paper elevation={3} className={classes.paper}>
        <Typography className={classes.paperTitle}>
          Resolve Listing IPFS URL
        </Typography>
        <FormControl fullWidth style={{ marginBottom: 12 }}>
          <TextField
            placeholder="Enter IPFS URL..."
            variant="outlined"
            onChange={(e) => handleIPFSHashResolveChange(e)}
          />
        </FormControl>
        <Button
          fullWidth
          variant="contained"
          onClick={handleResolveIPFS}
          color="primary"
          style={{ color: "white" }}
        >
          Resolve
        </Button>
        <Typography>
          <b>Title: </b> {resolvedTitle}
        </Typography>
        <Typography>
          <b>Description: </b> {resolvedDesc}
        </Typography>
        <img
          src= {resolvedImage}
        />
        <ReactAudioPlayer
          src= {resolvedMusic}
          controls
        />
      </Paper>
    );
  };
  /******************************************************/

  return (
    <div>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12}>
          <Grid container justify="center" direction="row" spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.paperTitle}>
                  Create Listing
                </Typography>
                {drawListingInputFields()}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleCreateListing}
                  color="primary"
                  style={{ color: "white" }}
                >
                  Create Listing
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.paperTitle}>
                  View Listings
                </Typography>
                {listings.map((listing) => (
                  <Paper variant="outlined">
                    <Typography>
                      <b>ID:</b> {listing["id"]}
                    </Typography>
                    <Typography>
                      <b>Title:</b> {listing["title"]}
                    </Typography>
                    <Typography>
                      <b>URI:</b> {listing["URI"]}
                    </Typography>
                    <Typography>
                      <b>Price:</b> {listing["price"]}
                    </Typography>
                    <Typography>
                      <b>Creator:</b> {listing["creator"]}
                    </Typography>
                  </Paper>
                ))}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleViewListings}
                  color="primary"
                  style={{ color: "white" }}
                >
                  View Listings
                </Button>
              </Paper>
            </Grid>
          </Grid>
          <Grid container justify="center" direction="row" spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.paperTitle}>
                  Buy License
                </Typography>
                <FormControl fullWidth style={{ marginBottom: 12 }}>
                  <TextField
                    placeholder="Enter Listing ID..."
                    variant="outlined"
                    onChange={(e) => handleBuyIDChange(e)}
                  />
                </FormControl>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleBuyListing}
                  color="primary"
                  style={{ color: "white" }}
                >
                  Buy License
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} className={classes.paper}>
                <Typography className={classes.paperTitle}>
                  View My Licenses
                </Typography>
                {myLicenses.map((license) => (
                  <Paper variant="outlined">
                    <Typography>
                      <b>Token ID:</b> {license["tokenId"]}
                    </Typography>
                    <Typography>
                      <b>Listing ID:</b> {license["id"]}
                    </Typography>
                    <Typography>
                      <b>Title:</b> {license["title"]}
                    </Typography>
                    <Typography>
                      <b>URI:</b> {license["URI"]}
                    </Typography>
                    <Typography>
                      <b>Price:</b> {license["price"]}
                    </Typography>
                    <Typography>
                      <b>Creator:</b> {license["creator"]}
                    </Typography>
                  </Paper>
                ))}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleGetLicenses}
                  color="primary"
                  style={{ color: "white" }}
                >
                  View My Licenses
                </Button>
              </Paper>
            </Grid>
          </Grid>
          <Grid container justify="center" direction="row" spacing={3}>
            <Grid item xs={12} md={6}>
              {drawUploadIPFSPaper()}
            </Grid>
            <Grid item xs={12} md={6}>
              {drawIPFSResolvePaper()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContractPlayground;

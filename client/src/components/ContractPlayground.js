import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import Web3 from "web3";
import BlockBeats from ".././contracts/Blockbeats.json";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

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
  const [listings, setListings] = useState([[]]);

  const [title, setTitle] = useState(null);
  const [URI, setURI] = useState(null);
  const [price, setPrice] = useState(null);

  const [buyingID, setBuyingID] = useState(null);

  const [myLicenses, setMyLicenses] = useState([]);

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
    if (networkId !== 5777) {
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleURIChange = (event) => {
    setURI(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(Number(event.target.value));
  };

  const handleBuyIDChange = (event) => {
    setBuyingID(Number(event.target.value));
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

  const handleViewListings = async () => {
    console.log("view listings");
    const listingsRet = await contract.methods.viewListings().call();
    console.log(listingsRet);
    setListings(listingsRet);
  };

  const handleCreateListing = async () => {
    console.log("create listing");
    let result = await contract.methods
      .createListing(title, price, URI)
      .send({ from: account });
    console.log(result);
  };

  const handleBuyListing = async () => {
    console.log("buy listing " + buyingID.toString());
    let listingPrice = getPriceOfListing(buyingID)
    await contract.methods.buyListing(buyingID).send({ from: account,
    value: listingPrice});
  };

  const handleGetLicenses = async () => {
    console.log("get license");
  };

  const getPriceOfListing = (id) => {
    return Number((listings.filter((item) => Number(item["id"]) === id)[0]["price"]));
  };

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
                    <Typography><b>ID:</b> {listing["id"]}</Typography>
                    <Typography><b>Title:</b> {listing["title"]}</Typography>
                    <Typography><b>URI:</b> {listing["URI"]}</Typography>
                    <Typography><b>Price:</b> {listing["price"]}</Typography>
                    <Typography><b>Creator:</b> {listing["creator"]}</Typography>
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
                    <Typography>{license}</Typography>
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
        </Grid>
      </Grid>
    </div>
  );
};

export default ContractPlayground;

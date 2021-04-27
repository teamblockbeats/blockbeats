import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Button,
  Typography,
  Box
} from "@material-ui/core";
import Web3 from "web3";
import BlockBeats from "../contracts/Blockbeats.json";

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

const Verify = () => {
  const classes = useStyles();

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [user, setUser] = useState(null);
  const [listingID, setListingID] = useState(null);


  const [checkedUser, setCheckedUser] = useState("");
  const [checkedListing, setCheckedListing] = useState("")
  const [verified, setVerified] = useState(null); // type: Boolean?

  /******************* BOOTSTRAPPING *****************/
  useEffect(() => {
    if (!window.web3) {
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
    } else {
      const deployedNetwork = BlockBeats.networks[networkId];
      const instance = new web3.eth.Contract(
        BlockBeats.abi,
        deployedNetwork.address
      );
      setContract(instance);
    }
  };
  /******************************************************/

  const handleVerify = async () => {
    console.log("verify");
    console.log(Number(listingID));
    console.log(user);
    setCheckedUser(user)
    setCheckedListing(Number(listingID))
    if (verified == null) {
      setVerified(true);
    } else {
      setVerified(!verified);
    }
  };

  const drawVerifyInputFields = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          placeholder="Enter User's Address..."
          variant="outlined"
          onChange={(e) => setUser(e.target.value)}
        />
        <TextField
          placeholder="Enter Unique Listing ID..."
          variant="outlined"
          onChange={(e) => setListingID(e.target.value)}
        />
      </FormControl>
    );
  };

  const drawVerified = () => {
    if (verified == null) {
      return;
    } else if (verified) {
      return (
        <Box display="flex" justifyContent="center" flexDirection="row" marginTop={2}>
          <CheckCircleIcon color="primary" style={{marginRight: 5}} fontSize="large"/>
          <Typography style={{margin: 5}}><b>Verified!</b>  User "{checkedUser}" has purchased a license for listing ID: {checkedListing}</Typography>
        </Box>
      );
    } else {
      return (
        <Box display="flex" justifyContent="center" flexDirection="row" marginTop={2}>
          <CancelIcon color="secondary" fontSize="large"/>
          <Typography style={{margin: 5}}><b>Unverified.</b>  User "{checkedUser}" has <b>not</b> purchased a license for listing ID: {checkedListing}</Typography>
        </Box>
      );
    }
  };

  return (
    <Grid container justify="center" direction="row" spacing={3}>
      <Grid item xs={12} md={9}>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.paperTitle}>
            Verify License Ownership
          </Typography>
          {drawVerifyInputFields()}
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerify}
            color="primary"
            style={{ color: "white" }}
          >
            Verify
          </Button>
          {drawVerified()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Verify;

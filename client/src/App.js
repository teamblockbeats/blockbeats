import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import Profile from "./components/Profile";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Upload from "./components/Upload";
import Listings from "./components/Listings";
import Verify from "./components/Verify";
import About from "./components/About";
import BlockBeats from "./contracts/Blockbeats.json";
import Web3 from "web3";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const App = () => {
  const [account, setAccount] = useState(null);
  const [invalidNetwork, setInvalidNetWork] = useState(false);
  const [contract, setContract] = useState(null);
  const [currency, setCurrency] = useState("ETH");

  const classes = useStyles();

  useEffect(() => {
    if (!window.web3) {
    } else {
      loadWeb3();
      loadBlockChainData();
    }
  });

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setInvalidNetWork(true);
    }
  };

  const loadBlockChainData = async () => {
    const web3 = window.web3;

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    // Check correct network
    const networkId = await web3.eth.net.getId();
    if (networkId !== 5777 && networkId !== 4 && networkId !== 137) {
      setInvalidNetWork(true);
    } else {
      const deployedNetwork = BlockBeats.networks[networkId];
      const instance = new web3.eth.Contract(
        BlockBeats.abi,
        deployedNetwork.address
      );
      setContract(instance);
    }
    if (networkId == 137) {
      setCurrency("MATIC");
    }
  };

  if (invalidNetwork) {
    return (
      <div>
        <Header account={account} />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Box display="flex">
              <Typography style={{ margin: "auto" }} variant="h5">
                Please switch to MATIC or Rinkeby Network
              </Typography>
            </Box>
          </Route>
        </Switch>
      </div>
    );
  }

  return (
    <Box className={classes.root}>
      <Header account={account} />
      <Switch>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/profile">
          <Profile contract={contract} account={account} currency={currency} />
        </Route>
        <Route path="/verify">
          <Verify />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/">
          <Listings />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;

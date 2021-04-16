import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Web3 from "web3";
import "./App.css";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import ContractPlayground from "./components/ContractPlayground";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Switch, Route, Link, NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  accountIcon: {
    marginLeft: theme.spacing(2),
  },
  addressButton: {
    background: "linear-gradient(90deg, #DE4278 30%, #42DEA8 90%)",
    color: "white",
  },
  addressText: {
    width: "100px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

const App = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [invalidNetwork, setInvalidNetWork] = useState(false);
  const [loading, setLoading] = useState(true);

  const classes = useStyles();

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
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork.address
      );
      setContract(instance);
      setLoading(false);
    }
  };
  if (loading) {
    return <div>loading</div>;
  }
  if (invalidNetwork) {
    return <div>Not using metamask with test network grr</div>;
  }
  const splitString = (value) => {
    const slice = Math.round(value.length / 10);
    return `${value.substr(0, slice)}...${value.substr(
      value.length - slice,
      value.length
    )}`;
  };

  return (
    <Box className={classes.root}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <LibraryMusicIcon fontSize="large" className={classes.logo} />
          <Typography variant="h5" className={classes.title}>
            BlockBeats
          </Typography>
          <Button className={classes.addressButton}>
            <Box class={classes.addressText}>{splitString(account)}</Box>
            <Box>{}</Box>
            <AccountCircleIcon
              fontSize="large"
              className={classes.accountIcon}
            />
          </Button>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/playground">
          <ContractPlayground />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;

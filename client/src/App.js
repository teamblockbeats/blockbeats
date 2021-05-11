import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Button, AppBar, Toolbar } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Profile from "./components/Profile";
import { Switch, Route, NavLink, Link } from "react-router-dom";
import Upload from "./components/Upload";
import Listings from "./components/Listings";
import Verify from "./components/Verify";
import About from "./components/About";
import BlockBeats from "./contracts/Blockbeats.json";
import Web3 from "web3";

const ACCEPTED_NETWORKS = [5777, 4, 137];
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
  menu: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));

const App = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [currency, setCurrency] = useState("ETH");

  const classes = useStyles();

  useEffect(() => {
    if (window.ethereum) {
      loadWeb3();
      loadBlockchainData();
    } else {
      setConnected(false);
      setStatus(
        "🦊 You must install Metamask in your browser: https://metamask.io/download.html"
      );
    }
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      setConnected(true);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      setConnected(true);
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    if (!ACCEPTED_NETWORKS.includes(networkId)) {
      setConnected(false);
      setStatus("🦊  Please switch to the MATIC or Rinkeby Network");
    } else {
      const deployedNetwork = BlockBeats.networks[networkId];
      const instance = new web3.eth.Contract(
        BlockBeats.abi,
        deployedNetwork.address
      );
      setContract(instance);
    }
    if (networkId === 137) {
      setCurrency("MATIC");
    }
  };

  if (!connected) {
    return (
      <Box className={classes.root}>
        <AppBar position="sticky" color="inherit">
          <Toolbar>
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}>
              <LibraryMusicIcon fontSize="large" className={classes.logo} />
            </NavLink>
            <Typography variant="h5" className={classes.title}>
              BlockBeats
            </Typography>
            <Box className={classes.menu}>
              <Button component={Link} to="/about">
                About
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/">
          <Box style={{ textAlign: "center" }}>
            <Typography variant="h4">{status}</Typography>
          </Box>
        </Route>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <LibraryMusicIcon fontSize="large" className={classes.logo} />
          </NavLink>
          <Typography variant="h5" className={classes.title}>
            BlockBeats
          </Typography>
          <Box className={classes.menu}>
            <Button component={Link} to="/">
              Browse
            </Button>
            <Button component={Link} to="/upload">
              Upload
            </Button>
            <Button component={Link} to="/verify">
              Verify
            </Button>
            <Button component={Link} to="/about">
              About
            </Button>
          </Box>
          <Button
            component={Link}
            to={{ pathname: `/profile` }}
            className={classes.addressButton}>
            <Box className={classes.addressText}>{account}</Box>
            <AccountCircleIcon
              fontSize="large"
              className={classes.accountIcon}
            />
          </Button>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/profile">
          <Profile contract={contract} account={account} currency={currency} />
        </Route>
        <Route path="/verify">
          <Verify contract={contract} account={account} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/">
          <Listings contract={contract} account={account} currency={currency} />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;

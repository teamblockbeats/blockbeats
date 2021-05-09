import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import ContractPlayground from "./components/ContractPlayground";
import Profile from "./components/Profile";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Licenses from "./components/Licenses";
import Upload from "./components/Upload";
import Listings from "./components/Listings";
import Verify from "./components/Verify";
import About from "./components/About";
import BlockBeats from "./contracts/Blockbeats.json";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const App = () => {
  const [accounts, setAccounts] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [invalidNetwork, setInvalidNetWork] = useState(false);
  const [contract, setContract] = useState(null);
  const [currency, setCurrency] = useState("ETH");

  const classes = useStyles();

  useEffect(() => {
    getWeb3()
      .then((web) => {
        setWeb3(web);

        web.eth
          .getAccounts()
          .then((accounts) => {
            setAccounts(accounts);
          })
          .catch((err) => {
            setInvalidNetWork(true);
          });

        web.eth.net
          .getId()
          .then((id) => {
            if (id !== 5777 && id !== 4 && id !== 137) {
              setInvalidNetWork(true);
            } else {
              const deployedNetwork = BlockBeats.networks[id];
              const instance = new web.eth.Contract(
                BlockBeats.abi,
                deployedNetwork.address
              );
              setContract(instance);
            }
            if (id == 137) {
              setCurrency("MATIC");
            }
          })
          .catch((err) => {
            setInvalidNetWork(true);
          });
      })
      .catch((err) => {
        setInvalidNetWork(true);
      });
  }, []);

  if (invalidNetwork) {
    return (
      <div>
        <Header web3={web3} accounts={accounts} />
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
      <Header web3={web3} accounts={accounts} />
      <Switch>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/profile">
          <Profile
            contract={contract}
            accounts={accounts}
            currency={currency}
          />
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

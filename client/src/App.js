import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import ContractPlayground from "./components/ContractPlayground";
import Profile from "./components/Profile";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Licenses from "./components/Licenses";
import Upload from "./components/Upload";
import Listings from "./components/Listings";
import Verify from "./components/Verify";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const App = () => {
  const [accounts, setAccounts] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [invalidNetwork, setInvalidNetWork] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    getWeb3().then((web) => {
      setWeb3(web);

      web.eth.getAccounts().then((accounts) => {
        setAccounts(accounts);
      });

      web.eth.net.getId().then((id) => {
        if (id !== 5777 && id !== 4) {
          setInvalidNetWork(true);
        }
      });
    });
  }, []);

  if (invalidNetwork) {
    return <div>Not using metamask with test network grr</div>;
  }

  return (
    <Box className={classes.root}>
      <Header web3={web3} accounts={accounts} />
      <Switch>
        <Route path="/playground">
          <ContractPlayground />
        </Route>
        <Route path="/upload">
          <Upload />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/licenses">
          <Licenses />
        </Route>
        <Route path="/verify">
          <Verify />
        </Route>
        <Route exact path="/">
          <Listings web3={web3} accounts={accounts} />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;

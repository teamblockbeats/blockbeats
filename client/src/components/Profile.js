import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

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
  list: {
    borderBottom: "1px solid white",
  },
}));

const Profile = ({ accounts, contract }) => {
  const classes = useStyles();

  const [account, setAccount] = useState(null);

  const [creations, setCreations] = useState([]);
  const [licenses, setLicenses] = useState([]);
  //{ tokenId: 0, id: 1, name: "aaa", price: 100 },
  //]);

  useEffect(() => {
    if (accounts !== null) {
      setAccount(accounts[0]);
    }
  }, [accounts]);

  useEffect(() => {
    if (contract !== null && account !== null) {
      console.log("loading account creations");
      loadCreations();
      loadLicenses();
    }
  }, [contract, account]);

  const loadCreations = async () => {
    const allListings = await contract.methods.viewListings().call();
    console.log(allListings);

    var myListings = [];
    for (const listing of allListings) {
      if (listing["creator"] == account) {
        myListings.push({
          id: listing["id"],
          name: listing["title"],
          price: listing["price"],
        });
      }
    }
    setCreations(myListings);
  };

  const loadLicenses = async () => {
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
      licenses.push({
        tokenId: tokenId,
        id: license["id"],
        name: license["title"],
        price: license["price"],
      });
    }

    setLicenses(licenses);
  };

  const ItemComponent = ({ creation }) => {
    const { tokenId, id, name, price } = creation;
    var xsSize;
    var tokenColumn;

    if (tokenId !== undefined) {
      xsSize = 6;
      tokenColumn = (
        <Grid item xs={2}>
          <Typography color="textPrimary">
            {" "}
            <b> Token #{tokenId}</b>
          </Typography>
        </Grid>
      );
    } else {
      xsSize = 8;
    }

    return (
      <ListItem button>
        <Grid container direction="row">
          {tokenColumn}
          <Grid item xs={2}>
            <Typography color="textPrimary">
              {" "}
              <b> Listing #{id}</b>
            </Typography>
          </Grid>
          <Grid item xs={xsSize}>
            <Typography color="textPrimary"> "{name}"</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color="textPrimary"> {price} WEI</Typography>
          </Grid>
        </Grid>
      </ListItem>
    );
  };

  const ListComponent = ({ title, items }) => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
      setOpen(!open);
    };

    return (
      <List className={classes.list}>
        <ListItem className={classes.listTab} button onClick={handleClick}>
          <ListItemText>
            <Typography color="textPrimary">
              <b>{title}</b>
            </Typography>
          </ListItemText>
          {open ? (
            <ExpandLess color="secondary" />
          ) : (
            <ExpandMore color="secondary" />
          )}
        </ListItem>
        <Collapse
          className={classes.subList}
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <List>
            {items &&
              items.map((item) => {
                return <ItemComponent creation={item} />;
              })}
          </List>
        </Collapse>
      </List>
    );
  };

  return (
    <Grid container justify="center" direction="row" spacing={3}>
      <Grid item xs={12} md={9}>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.paperTitle}>Account</Typography>

          <ListComponent
            title="Your Creations"
            items={creations}
          ></ListComponent>
          <ListComponent title="Your Licenses" items={licenses}></ListComponent>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;

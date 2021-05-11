import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
} from "@material-ui/core";
import ReactAudioPlayer from "react-audio-player";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
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
  root: {
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const Profile = ({ contract, account, currency }) => {
  const [creations, setCreations] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [currListing, setCurrListing] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);

  const classes = useStyles();

  const rootIPFSGateway = "https://ipfs.io/ipfs/";

  useEffect(() => {
    if (contract !== null && account !== null) {
      loadCreations();
      loadLicenses();
    }
  }, [contract, account]);

  const loadCreations = async () => {
    const allListings = await contract.methods.viewListings().call();

    var myListings = [];
    for (const listing of allListings) {
      if (listing["creator"] === account) {
        myListings.push({
          id: listing["id"],
          name: listing["title"],
          price: listing["price"],
          URI: listing["URI"],
          creator: listing["creator"],
        });
      }
    }
    setCreations(myListings);
  };

  const loadLicenses = async () => {
    let tokenIds = await contract.methods
      .tokensAtAddress(account)
      .call({ from: account });
    let licenses = [];

    for (const tokenId of tokenIds) {
      let license = await contract.methods
        .resolveTokenToListing(tokenId)
        .call({ from: account });
      license["tokenId"] = tokenId;
      licenses.push({
        tokenId: tokenId,
        id: license["id"],
        name: license["title"],
        price: license["price"],
        URI: license["URI"],
        creator: license["creator"],
      });
    }

    setLicenses(licenses);
  };

  const ItemComponent = ({ creation }) => {
    const { tokenId, id, name, price } = creation;
    var xsSize;
    var tokenColumn;

    if (tokenId !== undefined) {
      xsSize = 2;
      tokenColumn = (
        <Grid item xs={2}>
          <Typography color="textPrimary">
            {" "}
            <b> Token #{tokenId}</b>
          </Typography>
        </Grid>
      );
    } else {
      xsSize = 4;
    }

    return (
      <ListItem
        button
        onClick={() => {
          handleClickOpen(creation);
        }}>
        <Grid container direction="row">
          {tokenColumn}
          <Grid item xs={xsSize}>
            <Typography color="textPrimary">
              {" "}
              <b> Listing #{id}</b>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="textPrimary"> "{name}"</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color="textPrimary">
              {" "}
              {price / 1000000000000000000} {currency}
            </Typography>
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
          unmountOnExit>
          <List>
            {items &&
              items.map((item, index) => {
                return <ItemComponent key={index} creation={item} />;
              })}
          </List>
        </Collapse>
      </List>
    );
  };

  const removePrefix = (str, prefix) => {
    if (str && str.startsWith(prefix)) {
      return str.slice(prefix.length);
    } else {
      return str;
    }
  };

  const handleClose = () => {
    setCurrListing({});
    setPopupOpen(false);
  };

  const handleClickOpen = async (item) => {
    let jsonUrl = rootIPFSGateway + removePrefix(item.URI, "ipfs://");
    axios.get(jsonUrl).then(function (res) {
      setCurrListing({
        id: item.id,
        creator: item.creator,
        price: item.price,
        attributes: res.data.attributes,
        title: res.data.name,
        desc: res.data.description,
        image: rootIPFSGateway + removePrefix(res.data.image, "ipfs://"),
        music:
          rootIPFSGateway + removePrefix(res.data.animation_url, "ipfs://"),
      });
      setPopupOpen(true);
    });
  };

  const drawDialogue = () => {
    return (
      <Dialog onClose={handleClose} open={popupOpen} fullWidth>
        <DialogContent dividers>
          <Box display="flex">
            <Box>
              <img
                src={currListing.image}
                alt=""
                height="100"
                style={{
                  border: "2px solid #42DEA8",
                  marginRight: "10px",
                }}
              />
            </Box>
            <Box>
              <Typography variant="h5" className={classes.dialogTitle}>
                {currListing.title}
              </Typography>
              <Typography variant="caption">
                Created by {currListing.creator}
              </Typography>
              <ReactAudioPlayer src={currListing.music} controls />
            </Box>
          </Box>
          <Box className={classes.dialogDesc}>
            <Typography gutterBottom>{currListing.desc}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          {currListing.attributes &&
            currListing.attributes.map((attr, index) => (
              <Chip
                key={index}
                label={attr.value}
                variant="outlined"
                size="small"></Chip>
            ))}
          <Typography color="primary">
            {currListing.price / 1000000000000000000} {currency}
          </Typography>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      {drawDialogue()}
      <Box className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.paperTitle}>Account</Typography>

          <ListComponent
            title="Your Creations"
            items={creations}></ListComponent>
          <ListComponent title="Your Licenses" items={licenses}></ListComponent>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;

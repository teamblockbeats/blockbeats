import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
} from "@material-ui/core";
import image from "./godspeed.jpg";
import Web3 from "web3";
import BlockBeats from "../contracts/Blockbeats.json";
import axios from "axios";
import { LensOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  rootCard: {
    maxWidth: 345,
    minHeight: 300,
  },
  listingPrice: {
    marginLeft: theme.spacing(1),
  },
  grid: {
    marginTop: theme.spacing(1),
  },
}));

const Listings = () => {
  const classes = useStyles();

  const [listings, setListings] = useState([]);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const rootIPFSGateway = "https://ipfs.io/ipfs/";

  useEffect(() => {
    loadWeb3();
    loadBlockChainData();
  }, []);

  useEffect(() => {
    if (contract) {
      contract.methods
        .viewListings()
        .call()
        .then((res) => {
          resolveListings(res);
        });
    }
  }, [contract]);

  const removePrefix = (str, prefix) => {
    if (str && str.startsWith(prefix)) {
      return str.slice(prefix.length);
    } else {
      return str;
    }
  };

  const resolveListings = (listings) => {
    listings.forEach((lst) => {
      let jsonUrl = rootIPFSGateway + removePrefix(lst.URI, "ipfs://");
      axios.get(jsonUrl).then(function (res) {
        setListings((listings) => [
          ...listings,
          {
            id: lst.id,
            price: lst.price,
            title: res.data.name,
            desc: res.data.description,
            image: rootIPFSGateway + removePrefix(res.data.image, "ipfs://"),
            music:
              rootIPFSGateway + removePrefix(res.data.animation_url, "ipfs://"),
          },
        ]);
      });
    });
  };

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

  return (
    <Box className={classes.root}>
      <Typography variant="h4">Current listings</Typography>
      <Grid container spacing={3} className={classes.grid}>
        {listings.map((lst) => (
          <Grid item xs={3} key={lst.id}>
            <Card className={classes.rootCard}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="Contemplative Reptile"
                  height="140"
                  image={lst.image}
                />
                <CardContent>
                  <Typography component="h6" variant="h6">
                    {lst.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p">
                    {lst.desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Typography className={classes.listingPrice} color="primary">
                  {lst.price}
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Listings;

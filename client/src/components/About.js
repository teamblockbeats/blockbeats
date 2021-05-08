import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ReceiptIcon from "@material-ui/icons/Receipt";
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";
import { Typography, IconButton } from "@material-ui/core";

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
}));

const About = () => {
  const classes = useStyles();

  return (
    <Grid container justify="center" direction="row" spacing={3}>
      <Grid item xs={12} md={9}>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.paperTitle}>
            Welcome to BlockBeats!
          </Typography>
          <Typography style={{ textAlign: "left" }}>
            Blockbeats is the first <b>fully decentralised</b> platform for
            artists to acquire and distribute non-exclusive licenses to music
            samples. The mission of blockbeats is to put power back into the
            hands of artists and musicians with a fully peer-to-peer solution
            with no middle-man and no extra fees.
            <br></br>
            <br></br>
            To accomplish this mission, we have deployed a smart contract onto
            several popular compatible blockchains which this website serves as
            a interface for. Our smart contract allows for artists to upload
            "Listings" which represent a license for some music sample they have
            immutably attached to the listing.
            <br></br>
            <br></br>Artists wishing to buy a sample can see/preview all
            avaliable listings and can buy a listing they enjoy. On buying a
            listing, the buyer will pay the artist the specificed amount and an
            NFT representing license ownership will be minted and transfered to
            them.
            <br></br>
            <br></br>
            This model and use of NFTs allows for artists to cryptographically
            verify and prove ownership of a music sample,{" "}
            <b>without any middle-man</b>.
          </Typography>

          <Typography
          variant="h6"
          style={{ marginTop: 75, marginBottom: 10, textAlign:"center" }}>
              Links
          </Typography>
          <Grid
            justify="center"
            container
            direction="row"
          >
            <Grid
              container
              xs={3}
              justify="center"
              direction="column"
              alignItems="center"
              onClick={() => {
                console.log("AAA");
              }}
            >
              <IconButton
                onClick={() => {
                  window.location.href = "https://rinkeby.etherscan.io/address/0x799dfa2c0f28f566a70be10ad3b4227348743190";
                }}
                color="primary"
              >
                <ReceiptIcon />
              </IconButton>
              <Typography>Contract</Typography>
            </Grid>
            <Grid
              container
              xs={3}
              justify="center"
              direction="column"
              alignItems="center"
            >
              <IconButton
                onClick={() => {
                  window.location.href = "https://testnets.opensea.io/collection/blockbeats";
                }}
                color="primary"
              >
                <DirectionsBoatIcon />
              </IconButton>

              <Typography>Opensea</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default About;

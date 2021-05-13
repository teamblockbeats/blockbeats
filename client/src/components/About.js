import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Paper, Typography, IconButton } from "@material-ui/core";
import ReceiptIcon from "@material-ui/icons/Receipt";
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";

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
  root: {
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const About = () => {
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.root}>
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
            style={{ marginTop: 75, marginBottom: 10, textAlign: "center" }}>
            Links
          </Typography>
          <Grid justify="center" container direction="row">
            <Grid
              container
              xs={3}
              justify="center"
              direction="column"
              alignItems="center">
              <IconButton
                onClick={() => {
                  window.location.href =
                    "https://explorer-mainnet.maticvigil.com/address/0x97c73dB41BFbF2B8c3d1Ea2f3C1193ae429a9226/transactions";
                }}
                color="primary">
                <ReceiptIcon />
              </IconButton>
              <Typography style={{ textAlign: "center" }}>MATIC</Typography>
            </Grid>
            <Grid
              container
              xs={3}
              justify="center"
              direction="column"
              alignItems="center">
              <IconButton
                onClick={() => {
                  window.location.href = "https://matic.opensea.io";
                }}
                color="primary">
                <DirectionsBoatIcon />
              </IconButton>
              <Typography style={{ textAlign: "center" }}>
                Matic Opensea
              </Typography>
            </Grid>
            <Grid
              container
              xs={3}
              justify="center"
              direction="column"
              alignItems="center">
              <IconButton
                onClick={() => {
                  window.location.href =
                    "https://rinkeby.etherscan.io/address/0xffe7b7a97fa54f6fbdd3283cd2f53b2fd7aa4f1e";
                }}
                color="secondary">
                <ReceiptIcon />
              </IconButton>
              <Typography style={{ textAlign: "center" }}>Rinkeby</Typography>
            </Grid>
            <Grid
              container
              xs={3}
              justify="center"
              direction="column"
              alignItems="center">
              <IconButton
                onClick={() => {
                  window.location.href =
                    "https://testnets.opensea.io/collection/blockbeats-v2";
                }}
                color="secondary">
                <DirectionsBoatIcon />
              </IconButton>

              <Typography style={{ textAlign: "center" }}>
                Rinkeby Opensea
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default About;

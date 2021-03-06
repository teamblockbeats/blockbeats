import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { Button, Typography, Box, CircularProgress } from "@material-ui/core";

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

const Verify = ({ account, contract }) => {
  const [user, setUser] = useState(null);
  const [listingIDField, setlistingIDField] = useState(null);
  const [checkedUser, setCheckedUser] = useState("");
  const [checkedListing, setCheckedListing] = useState("");
  const [verified, setVerified] = useState(null);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const concatAddress = (totalLength, addr) => {
    let x = (totalLength - 3) / 2;
    return (
      addr.substr(0, x + 1) +
      "..." +
      addr.substring(addr.length - x, addr.length)
    );
  };

  const addrOwnsListing = async (addr, listingID) => {
    let tokenIds = await contract.methods
      .tokensAtAddress(addr)
      .call({ from: account });
    for (const tokenId of tokenIds) {
      let listing = await contract.methods
        .resolveTokenToListing(tokenId)
        .call({ from: account });
      if (Number(listing["id"]) === listingID) {
        return true;
      }
    }

    return false;
  };

  const handleVerify = async () => {
    setLoading(true);
    setVerified(
      (await addrOwnsListing(user, Number(listingIDField))).valueOf()
    );

    setCheckedUser(concatAddress(10, user));
    setCheckedListing(Number(listingIDField));
    setLoading(false);
  };

  const drawVerifyInputFields = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          placeholder="Enter User's Address"
          variant="outlined"
          onChange={(e) => setUser(e.target.value)}
        />
        <TextField
          placeholder="Enter Unique Listing ID"
          variant="outlined"
          onChange={(e) => setlistingIDField(e.target.value)}
        />
      </FormControl>
    );
  };

  const drawVerified = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" marginTop={2}>
          <CircularProgress />
        </Box>
      );
    }
    if (verified == null) {
      return;
    } else if (verified) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="row"
          marginTop={2}>
          <CheckCircleIcon
            color="primary"
            style={{ marginRight: 5 }}
            fontSize="large"
          />
          <Typography style={{ margin: 5 }}>
            <b>Verified!</b> User "{checkedUser}" has purchased a license for
            listing ID: {checkedListing}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="row"
          marginTop={2}>
          <CancelIcon color="secondary" fontSize="large" />
          <Typography style={{ margin: 5 }}>
            <b>Unverified.</b> User "{checkedUser}" has <b>not</b> purchased a
            license for listing ID: {checkedListing}
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Box>
      <Box className={classes.root}>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.paperTitle}>
            Verify License Ownership
          </Typography>
          {drawVerifyInputFields()}
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerify}
            color="primary"
            style={{ color: "white" }}>
            Verify
          </Button>
          {drawVerified()}
        </Paper>
      </Box>
    </Box>
  );
};

export default Verify;

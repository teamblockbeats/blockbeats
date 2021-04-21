import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { Button, Typography, CircularProgress, Box } from "@material-ui/core";


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
}));

const Upload = () => {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(Number(event.target.value));
  };

  const drawListingInputFields = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          placeholder="Enter title..."
          variant="outlined"
          onChange={(e) => handleTitleChange(e)}
        />
        <TextField
          placeholder="Enter Description..."
          variant="outlined"
          onChange={(e) => handleDescriptionChange(e)}
        />
        <TextField
          placeholder="Enter Price (WEI)..."
          variant="outlined"
          onChange={(e) => handlePriceChange(e)}
        />
      </FormControl>
    );
  };

  const handleCreateListing = async () => {
    console.log("create listing");
  };

  return (
    <Grid container justify="center" direction="row" spacing={3}>
      <Grid item xs={12} md={9}>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.paperTitle}>Create Listing</Typography>
          {drawListingInputFields()}
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateListing}
            color="primary"
            style={{ color: "white" }}
          >
            Create Listing
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Upload;

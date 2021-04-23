import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import {
  Button,
  Typography,
  Box,
  FormLabel,
} from "@material-ui/core";

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

  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [BPM, setBPM] = useState(0);

  const [musicFile, setMusicFile] = useState(null);
  const [artFile, setArtFile] = useState(null);

  /************* HANDLERS ******************/
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(Number(event.target.value));
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleBPMChange = (event) => {
    setBPM(Number(event.target.value));
  };

  const handleSampleFileChange = (event) => {
    setMusicFile(event.target.files[0]);
  };

  const handleArtFileChange = (event) => {
    setArtFile(event.target.files[0]);
  }
  /***************************************/

  const handleCreateListing = async () => {
    console.log("create listing");

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
        <Box display="flex" flexDirection="row" paddingTop={2} padding={2}>
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            paddingRight={3}
          >
            <TextField
              label="Genre"
              onChange={(e) => handleGenreChange(e)}
            />
            <TextField
              label="Language"
              onChange={(e) => handleLanguageChange(e)}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            paddingLeft={3}
          >
            <TextField
              label="BPM"
              onChange={(e) => handleBPMChange(e)}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          padding={3}
        >
          <Box display="flex" flexDirection="column">
            <FormLabel htmlFor="upload-music">Upload Music</FormLabel>
            <TextField
              name="upload-music"
              type="file"
              id="upload-music"
              variant="outlined"
              onChange={(e) => handleSampleFileChange(e)}
            />
          </Box>

          <Box display="flex" flexDirection="column">
            <FormLabel htmlFor="upload-art">Upload Cover Art</FormLabel>
            <TextField
              name="upload-art"
              type="file"
              id="upload-art"
              variant="outlined"
              onChange={(e) => handleArtFileChange(e)}
            />
          </Box>
        </Box>
      </FormControl>
    );
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

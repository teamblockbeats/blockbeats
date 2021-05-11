import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Box,
  FormLabel,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  TextField,
  FormControl,
} from "@material-ui/core";
import { pinListingToIPFS } from "./pinataAPI";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
  },
  paperTitle: {
    textAlign: "center",
    fontSize: "1.5em",
    paddingBottom: "15px",
  },
  root: {
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const Upload = ({ contract, account }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [BPM, setBPM] = useState(0);
  const [key, setKey] = useState("");
  const [trackType, setTrackType] = useState("");
  const [musicFile, setMusicFile] = useState(null);
  const [artFile, setArtFile] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(undefined);

  const classes = useStyles();

  const keys = [
    "N/A",
    "A flat major",
    "A flat minor",
    "A major",
    "A minor",
    "B flat major",
    "B flat minor",
    "B major",
    "B minor",
    "C flat major",
    "C flat minor",
    "C major",
    "C minor",
    "D flat major",
    "D flat minor",
    "D major",
    "D minor",
    "E flat major",
    "E flat minor",
    "E major",
    "E minor",
    "F flat major",
    "F flat minor",
    "F major",
    "F minor",
    "G flat major",
    "G flat minor",
    "G major",
    "G minor",
  ];

  const trackTypes = [
    "N/A",
    "Multi-track",
    "Bass",
    "Drums",
    "Edits",
    "FX track",
    "Acoustic Guitar",
    "Electric Guitar",
    "Horns",
    "Instrumental",
    "Keyboards",
    "Master",
    "Percussion",
    "Sound FX",
    "Strings",
    "Vocals",
  ];

  /************* HANDLERS ******************/
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(Number(event.target.value) * 1000000000000000000);
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
  };
  /***************************************/

  const onIpfsSuccess = async (ipfsURI) => {
    setLoadingStatus("Submitting to Smart Contract...");
    let result = await contract.methods
      .createListing(title, price.toString(), ipfsURI)
      .send({ from: account });
    setLoadingStatus("Done!");
  };

  const handleCreateListing = async () => {
    let apiKey = "2a7bbddb5e255f5539ee";
    let apiSecretKey =
      "e0672966a87e1a831754cc3fffb846b9d40d4a6522553a55300b2f1f6a2ca477";

    pinListingToIPFS(
      apiKey,
      apiSecretKey,
      musicFile,
      artFile,
      title,
      description,
      {
        genre: genre,
        language: language,
        BPM: BPM,
        key: key,
        trackType: trackType,
      },
      (status) => {
        setLoadingStatus(status);
      },
      onIpfsSuccess
    );
  };

  const drawListingInputFields = () => {
    return (
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <TextField
          placeholder="Enter Title"
          variant="outlined"
          onChange={(e) => handleTitleChange(e)}
        />
        <TextField
          placeholder="Enter Description"
          variant="outlined"
          onChange={(e) => handleDescriptionChange(e)}
        />
        <TextField
          placeholder="Enter Price (ETH or MATIC)"
          variant="outlined"
          onChange={(e) => handlePriceChange(e)}
        />
        <Box display="flex" flexDirection="row" paddingTop={2} padding={2}>
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            paddingRight={3}>
            <TextField label="Genre" onChange={(e) => handleGenreChange(e)} />
            <TextField
              label="Language"
              onChange={(e) => handleLanguageChange(e)}
            />
            <FormControl>
              <InputLabel id="type-select-label">Track Type</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                value={trackType}
                onChange={(e) => {
                  setTrackType(e.target.value);
                }}>
                {trackTypes.map((trackType, index) => (
                  <MenuItem key={index} value={trackType}>
                    {trackType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            paddingLeft={3}>
            <TextField label="BPM" onChange={(e) => handleBPMChange(e)} />
            <FormControl>
              <InputLabel id="key-select-label">Key</InputLabel>
              <Select
                labelId="key-select-label"
                id="key-select"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                }}>
                {keys.map((key, index) => (
                  <MenuItem key={index} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          padding={3}>
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

  const drawUploadButton = () => {
    let stateText = loadingStatus;

    if (stateText === "Done!" || stateText === "Failed") {
      return (
        <Box display="flex" justifyContent="center">
          <Typography variant="h6">{stateText}</Typography>
        </Box>
      );
    } else if (stateText) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
          <Typography variant="h6" style={{ paddingLeft: 10, paddingTop: 4 }}>
            {stateText}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Button
          fullWidth
          variant="contained"
          onClick={handleCreateListing}
          color="primary"
          style={{ color: "white" }}>
          Create Listing
        </Button>
      );
    }
  };

  return (
    <Box className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <Typography className={classes.paperTitle}>Create Listing</Typography>
        {drawListingInputFields()}
        {drawUploadButton()}
      </Paper>
    </Box>
  );
};

export default Upload;

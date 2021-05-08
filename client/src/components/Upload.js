import React, { useState, useEffect } from "react";
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
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { pinListingToIPFS } from "./pinataAPI";
import Web3 from "web3";
import BlockBeats from "../contracts/Blockbeats.json";

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

const Upload = () => {
  const classes = useStyles();

  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

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

  /******************* BOOTSTRAPPING *****************/
  useEffect(() => {
    if (!window.web3) {
    } else {
      loadWeb3();
      loadBlockChainData();
    }
  }, []);

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
  /******************************************************/

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
  };
  /***************************************/

  const onIpfsSuccess = async (ipfsURI) => {
    console.log(ipfsURI);
    setLoadingStatus("Submitting to Smart Contract...");
    let result = await contract.methods
      .createListing(title, price, ipfsURI)
      .send({ from: account });
    setLoadingStatus("Done!");
    console.log(result);
  };

  const handleCreateListing = async () => {
    console.log("create listing");
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
                {trackTypes.map((trackType) => (
                  <MenuItem value={trackType}>{trackType}</MenuItem>
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
                {keys.map((key) => (
                  <MenuItem value={key}>{key}</MenuItem>
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
    <Grid container justify="center" direction="row" spacing={3}>
      <Grid item xs={12} md={9}>
        <Paper elevation={3} className={classes.paper}>
          <Typography className={classes.paperTitle}>Create Listing</Typography>
          {drawListingInputFields()}
          {drawUploadButton()}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Upload;

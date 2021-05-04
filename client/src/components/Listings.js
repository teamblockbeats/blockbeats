import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Box,
  Typography,
  Card,
  Button,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
} from "@material-ui/core";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import IconButton from "@material-ui/core/IconButton";
import image from "./godspeed.jpg";
import theme from "../theme";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  rootCard: {
    maxWidth: 345,
  },
  listingPrice: {
    marginLeft: theme.spacing(1),
  },
}));

const Listings = ({ web3, accounts }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <Typography variant="h4">Current listings</Typography>
        <Card className={classes.rootCard}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="140"
              image={image}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography component="h6" variant="h6">
                Lift Your Skinny Fists
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Godspeed You! Black Emporer
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Typography className={classes.listingPrice} color="primary">
              0.01 ETH
            </Typography>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default Listings;

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
    margin: theme.spacing(1),
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
      <Grid container xs={12} spacing={3}>
        <Grid item>
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
                <Typography component="h5" variant="h5">
                  Lift Your Skinny Fists
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Godspeed You! Black Emporer
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lift Your Skinny Fists Like Antennas to Heaven, or Levez Vos
                  Skinny Fists Comme Antennas to Heaven on the rear of physical
                  releases, is the second studio album by Canadian post-rock
                  band Godspeed You! Black Emperor, released as a double album
                  on 9 October 2000 on vinyl by Constellation and 8 November
                  2000 on CD by Kranky.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Typography className={classes.listingPrice} color="primary">
                0.01 ETH
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Listings;

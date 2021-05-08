import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@material-ui/core";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  accountIcon: {
    marginLeft: theme.spacing(2),
  },
  addressButton: {
    background: "linear-gradient(90deg, #DE4278 30%, #42DEA8 90%)",
    color: "white",
  },
  addressText: {
    width: "100px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  menu: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));

const Header = ({ web3, accounts }) => {
  const classes = useStyles();
  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar>
        <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <LibraryMusicIcon fontSize="large" className={classes.logo} />
        </NavLink>
        <Typography variant="h5" className={classes.title}>
          BlockBeats
        </Typography>
        <Box className={classes.menu}>
          <Button component={Link} to="/">
            Browse
          </Button>
          <Button component={Link} to="/upload">
            Upload
          </Button>
          <Button component={Link} to="/verify">
            Verify
          </Button>
          <Button component={Link} to="/about">
            About
          </Button>
        </Box>
        <Button
          component={Link}
          to={{ pathname: `/profile` }}
          className={classes.addressButton}>
          <Box class={classes.addressText}>{accounts}</Box>
          <AccountCircleIcon fontSize="large" className={classes.accountIcon} />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

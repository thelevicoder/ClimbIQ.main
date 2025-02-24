import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StoreIcon from "@mui/icons-material/Store";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCart from "@mui/icons-material/ShoppingCart";

export const PageLayout = ({ user, setCurrentUser }) => {
  const [able, setAble] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const drawerWidth = 240;

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    color: "black",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  const AppBar = styled(MuiAppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#193c59",
    borderRadius: "10px",
    padding: "10px 20px",
    marginLeft: "50px",
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const DirectToDelete = () => {
    navigate("/delete-account", { state: user });
    console.log("this should take you somewhere");
  };

  const DirectToUpdate = () => {
    console.log(`user: ${user.firstName}`);
    navigate("/update-account", { state: user });
  };

  const DirectToLogout = () => {
    setAble(true);
    console.log("directing to logout page");
    navigate("/login");
  };

  const DirectToShop = () => {
    setAble(true);
    console.log("directing to shop page");
    navigate("/shop", { state: user });
  };

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#095043b0",
          marginTop: "0px",
          borderRadius: "0",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1px",
          }}
        >
          <Typography variant="h6" noWrap component="div">
            <div className="logo-container-small">
              <img src="newlogo.png" alt="ClimbIQ Logo" width="50px"/>
            </div>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              padding: "0 10px",
            }}
          >
            <ListItem
              key="Edit Profile"
              disablePadding
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ListItemButton
                sx={{ minHeight: 48, px: 2.5, flexGrow: 1 }}
                onClick={() => navigate("/update-account", { state: user })}
              >
                <ListItemIcon sx={{ justifyContent: "center" }}>
                  <ManageAccountsIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText primary="Edit Profile" sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
            <ListItem
              key="Logout"
              disablePadding
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ListItemButton
                sx={{ minHeight: 48, px: 2.5, flexGrow: 1 }}
                onClick={() => navigate("/login")}
              >
                <ListItemIcon sx={{ justifyContent: "center" }}>
                  <LogoutIcon sx={{ color: "red" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Toolbar>
      </AppBar>
    </div>
  );
};

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { Box, CssBaseline, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StoreIcon from '@mui/icons-material/Store';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCart from '@mui/icons-material/ShoppingCart';

export const PageLayout = ({ user, setCurrentUser }) => {
  const [able, setAble] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const drawerWidth = 240;

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    color: 'black',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const DirectToDelete = () => {
    navigate('/delete-account', { state: user });
    console.log('this should take you somewhere');
  };

  const DirectToUpdate = () => {
    console.log(`user: ${user.firstName}`);
    navigate('/update-account', { state: user });
  };

  const DirectToLogout = () => {
    setAble(true);
    console.log('directing to logout page');
    navigate('/login');
  };

  const DirectToShop = () => {
    setAble(true);
    console.log('directing to shop page');
    navigate('/shop', { state: user });
  };

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
          >
            <MenuIcon sx={{ color: 'gray' }} />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <div className='logo-container-side'>
              <img src="thatpivc.png" alt="WebWiz Logo" className="logo" />
              <span className="logo-text-side">WEBWIZ</span>
            </div>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="black"
            aria-label="open cart"
            onClick={() => navigate('/cart')}
            sx={{ marginRight: 1 }}
          >
            <ShoppingCart sx={{ color: 'black', transform: 'scale(1.5)' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} paperProps={{ sx: { backgroundColor: '' } }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key="Shop" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
              onClick={DirectToShop}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}
              >
                <StoreIcon sx={{ color: 'cornflowerBlue' }} />
              </ListItemIcon>
              <ListItemText primary="Shop" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key="Services" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}
              >
                <HomeRepairServiceIcon sx={{ color: 'cornflowerBlue' }} />
              </ListItemIcon>
              <ListItemText primary="Services" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key="Recently Purchased" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}
              >
                <ShoppingBasketIcon sx={{ color: 'cornflowerBlue' }} />
              </ListItemIcon>
              <ListItemText primary="Recently Purchased" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key="Edit Profile" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
              onClick={DirectToUpdate}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}
              >
                <ManageAccountsIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key="About Us" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
              onClick={null}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}
              >
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About Us" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key="Support" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}
              >
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Support" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem key="Logout" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}
              onClick={DirectToLogout}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}
              >
                <LogoutIcon sx={{ color: 'red' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

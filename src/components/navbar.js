// material ui stuffs
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import Hidden from "@mui/material/Hidden";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import { blueGrey } from "@mui/material/colors";

// firebase stuufs
import { getAuth } from "firebase/auth";

// react stuffs
import { useState } from "react";
import Link from "react-router-dom/Link";

function Navbar({ is_student }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSignOut = () => {
    getAuth().signOut();
  };

  return (
    <div>
      <AppBar position="sticky" sx={{ backgroundColor: blueGrey[900] }}>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            flexGrow={1}
            alignItems="center"
          >
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              <Typography variant="h6" component="div">
                Pandemification
              </Typography>
            </Link>
            <Hidden lgDown>
              <Stack direction="row" spacing={6}>
                <Tooltip title="Let's GG" enterDelay={800} arrow>
                  <Link
                    to="/"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <Typography variant="p">Dashboard</Typography>
                  </Link>
                </Tooltip>

                <Tooltip
                  title="See how well you perform along with others."
                  enterDelay={800}
                  arrow
                >
                  <Link
                    to="/leaderboards"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <Typography variant="p">Leaderboards</Typography>
                  </Link>
                </Tooltip>

                <Tooltip
                  title="Have something in your mind? share here."
                  enterDelay={800}
                  arrow
                >
                  <Link
                    to="/tripfeed"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    <Typography variant="p">Trip Feed</Typography>
                  </Link>
                </Tooltip>

                {is_student === false && (
                  <Tooltip title="Statistics here" enterDelay={800} arrow>
                    <Link
                      to="/stats"
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      <Typography variant="p">Stats</Typography>
                    </Link>
                  </Tooltip>
                )}
              </Stack>

              <Tooltip title="User Settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="account-menu"
                  aria-haspopup="true"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  color="inherit"
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Hidden>
            <Hidden lgUp>
              <IconButton
                size="large"
                aria-label="burgermenu"
                aria-controls="account-menu"
                aria-haspopup="true"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Stack>
        </Toolbar>

        <Menu
          id="burgermenu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuList>
            <Hidden lgUp>
              <MenuItem>
                <Link to="/" style={{ color: "black", textDecoration: "none" }}>
                  <Typography variant="p">Dashboard</Typography>
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem>
                <Link
                  to="/leaderboards"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Typography variant="p">Leaderboards</Typography>
                </Link>
              </MenuItem>
              <Divider />
              <MenuItem>
                <Link
                  to="/tripfeed"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Typography variant="p">Trip Feed</Typography>
                </Link>
              </MenuItem>
              <Divider />
            </Hidden>
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Link to="/" style={{ color: "black", textDecoration: "none" }}>
                SignOut
              </Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </AppBar>
    </div>
  );
}

export default Navbar;

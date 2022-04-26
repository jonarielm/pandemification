import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

import { getAuth } from "firebase/auth";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Link from "react-router-dom/Link";

import firebase from "../firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
const db = firebase.firestore();

function UserCard({ user_data, oa_pts, weekly_pts }) {
  const [badges, isLoading] = useDocumentData(
    firebase.firestore().doc("u_badge_earns/" + getAuth().currentUser.email)
  );

  return (
    <div style={{ padding: 20 + "px" }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Avatar
            alt="Avatar"
            src={getAuth().currentUser.photoURL}
            sx={{ width: 64, height: 64 }}
          />

          <Stack>
            <Typography variant="body1">
              <strong>{getAuth().currentUser.displayName}</strong>
            </Typography>

            {user_data.is_student ? (
              <Typography variant="caption">PPoints: {oa_pts}</Typography>
            ) : null}

            {user_data.is_student ? (
              <Typography variant="caption">
                Weekly PPoints: {weekly_pts}
              </Typography>
            ) : (
              <Typography variant="caption">Admin</Typography>
            )}
          </Stack>
        </Stack>
        <Divider />
        {user_data.is_student ? (
          <Typography variant="body1">
            <strong>EARNED BADGES</strong>
          </Typography>
        ) : null}

        {user_data.is_student ? (
          <Grid container>
            {badges ? (
              Object.values(badges).map((badge, idx) => (
                <Grid item xs={3} key={idx}>
                  <Badge color="secondary" badgeContent={0}>
                    <Tooltip title={badge.badge_title} arrow>
                      <Avatar src={badge.badge_url} />
                    </Tooltip>
                  </Badge>
                </Grid>
              ))
            ) : (
              <Typography variant="caption">
                It seems that you haven't earned any badge yet...
              </Typography>
            )}
          </Grid>
        ) : null}

        <Link to="/badges" style={{ color: "white", textDecoration: "none" }}>
          <Stack>
            <Button variant="outlined">Show All Available Badges</Button>
          </Stack>
        </Link>
      </Stack>
    </div>
  );
}

export default UserCard;

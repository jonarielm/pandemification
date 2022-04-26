import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import firebase from "../firebase";
import { getAuth } from "firebase/auth";

import { useEffect, useState } from "react";

const db = firebase.firestore();

function BadgeCard({
  badge_idnum,
  badge_title,
  badge_url,
  badge_desc,
  badge_goal,
  badge_form_url,
  user_data,
  handleOpenModalBadge,
}) {
  const [user_progress, setUserProgress] = useState(0);
  var user_field = "";
  if (badge_idnum === 1) user_field = "num_login";
  else if (badge_idnum === 2) user_field = "num_triv";
  else if (badge_idnum === 3) user_field = "mq_progress";
  else if (badge_idnum === 4) user_field = "num_rev";
  else if (badge_idnum === 5) user_field = "numHighGrade";
  else if (badge_idnum === 6) user_field = "numPerfect";
  else if (badge_idnum === 7) user_field = "numEarly";
  else if (badge_idnum === 8) user_field = "num_login";
  else if (badge_idnum === 9) user_field = "numComplete";
  else if (badge_idnum === 10) user_field = "numLateSub";
  else if (badge_idnum === 11) user_field = "numCams";
  else if (badge_idnum === 12) user_field = "num_triv";
  else if (badge_idnum === 13) user_field = "num_triv";
  else if (badge_idnum === 14) user_field = "mq_progress";
  else if (badge_idnum === 15) user_field = "mq_progress";
  else if (badge_idnum === 16) user_field = "num_rev";
  else if (badge_idnum === 17) user_field = "num_rev";
  else if (badge_idnum === 18) user_field = "numBug";
  else if (badge_idnum === 19) user_field = "numWeeklyTriumphs";
  else if (badge_idnum === 20) user_field = "numApex";
  else if (badge_idnum === 21) user_field = "numUncrownedKing";
  else if (badge_idnum === 22) user_field = "numThrillSeeker";
  else if (badge_idnum === 23) user_field = "numComment";

  useEffect(() => {
    if (user_field != "") {
      var progress = user_data[user_field];
      if (progress > badge_goal) progress = badge_goal;
      setUserProgress(progress);
    }
  }, []);

  return (
    <Grid item xs={12} md={4} padding="1rem">
      <Card variant="outlined">
        <Stack padding="1rem" spacing="1rem">
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="overline">
              <strong>{badge_title}</strong>
            </Typography>
            {user_data.is_student === false && (
              <IconButton
                onClick={() =>
                  handleOpenModalBadge({
                    badge_idnum: badge_idnum,
                    badge_title: badge_title,
                    badge_url: badge_url,
                    badge_goal: badge_goal,
                    badge_userfield: user_field,
                  })
                }
              >
                <AddIcon fontSize="small" color="primary" />
              </IconButton>
            )}
          </Stack>

          <img
            align
            src={badge_url}
            style={{
              maxWidth: "150px",
              maxHeight: "150px",
              alignSelf: "center",
            }}
          />

          <LinearProgress
            variant="determinate"
            color={user_progress >= badge_goal ? "success" : "primary"}
            value={(user_progress / badge_goal) * 100}
            sx={{ height: "15px", borderRadius: "5px" }}
          />

          <Typography variant="overline" textAlign="center">
            {user_progress} / {badge_goal}
          </Typography>

          <Typography variant="caption">{badge_desc}</Typography>

          {badge_form_url && (
            <Button
              variant="outlined"
              size="small"
              fontSize="small"
              href={badge_form_url}
              target="_blank"
              startIcon={<UploadFileIcon />}
            >
              Upload proof
            </Button>
          )}
        </Stack>
      </Card>
    </Grid>
  );
}

export default BadgeCard;

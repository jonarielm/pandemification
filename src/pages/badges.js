import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { useState, useEffect } from "react";

import BadgeCard from "../components/badge";

//import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import badges from "../components/forms/cards.json";

import firebase from "../firebase";
import { getAuth } from "firebase/auth";
const db = firebase.firestore();

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Badges({ user_data, email }) {
  /*
  const [badges] = useCollectionDataOnce(
    db.collection("badges").orderBy("idnum")
  );
  */

  useEffect(() => {
    db.collection("users")
      .doc(getAuth().currentUser.email)
      .update({
        badgePage: firebase.firestore.FieldValue.increment(1),
      });
  }, []);

  const [openModalBadge, setOpenModalBadge] = useState(false);
  const [modalData, setModalData] = useState({
    badge_idnum: 0,
    badge_title: "",
    badge_url: "",
    badge_goal: "",
    badge_userfield: "",
  });

  const [awardee, setAwardee] = useState(null);

  function handleOpenModalBadge(data) {
    console.log(data);
    setOpenModalBadge(true);
    setModalData(data);
  }

  const handleAwardButton = () => {
    if (awardee != null) {
      var strJSON =
        '{"b' +
        modalData.badge_idnum +
        '":{"badge_title": "' +
        modalData.badge_title +
        '" ,"badge_url": "' +
        modalData.badge_url +
        '" ,"earner": "' +
        awardee +
        '" ,"earnedAt": ' +
        JSON.stringify(firebase.firestore.Timestamp.now().toDate()) +
        " }}";

      db.collection("u_badge_earns")
        .doc(awardee)
        .set(JSON.parse(strJSON), { merge: true });

      // update user points

      var str =
        '{"' + modalData.badge_userfield + '": ' + modalData.badge_goal + " }";

      console.log(JSON.parse(str));

      db.collection("users").doc(awardee).update(JSON.parse(str));

      alert(
        "Successful badge " + modalData.badge_title + " to " + awardee + "."
      );

      setOpenModalBadge(false);
    } else {
      alert("Text area should not be empty.");
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Paper style={{ padding: "1rem" }}>
          <Typography variant="h6">Gamification Badges</Typography>
          <Typography variant="body2">
            Collect all the badges by using the pandemification app while
            learning and having fun!
          </Typography>
          <Divider />

          <Grid container>
            {badges &&
              badges.map((badge) => (
                <BadgeCard
                  key={badge.idnum}
                  badge_idnum={badge.idnum}
                  badge_title={badge.b_title}
                  badge_url={badge.b_url}
                  badge_desc={badge.b_desc}
                  badge_goal={badge.goal}
                  badge_form_url={badge.form_url}
                  user_data={user_data}
                  handleOpenModalBadge={handleOpenModalBadge}
                />
              ))}
          </Grid>
        </Paper>
      </Grid>
      <Modal open={openModalBadge}>
        <Box sx={modalStyle}>
          <Stack spacing="1rem">
            <Typography variant="overline">
              <strong>{modalData.badge_title} BADGE</strong>
            </Typography>

            <img
              src={modalData.badge_url}
              width="200"
              style={{ alignSelf: "center" }}
            />

            <TextField
              id="standard-basic"
              label="Enter email of the rewardee"
              variant="outlined"
              onChange={(e) => setAwardee(e.target.value)}
            />

            <Button
              variant="outlined"
              color="success"
              onClick={handleAwardButton}
            >
              award
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenModalBadge(false)}
            >
              close
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Grid>
  );
}

export default Badges;

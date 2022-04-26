import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Alert from "@mui/material/Alert";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

import { useState, useEffect } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";

import firebase from "../firebase";
import { getAuth } from "firebase/auth";

const db = firebase.firestore();

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "20rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function DQItem({
  num_triv,
  num_login,
  quest_id,
  q_type,
  q_name,
  q_details,
  imgURL,
  pts,
  qData,
  qAns,
  oa_pts,
  setOAPts,
  weekly_pts,
  setWeeklyPts,
  rank,
  setRank,
  is_student,
  expiration,
  setOpenNotif,
  setNotifContent,
}) {
  // for quest verdict
  const [verdict, setVerdict] = useState(null);
  const [answer, setAnswer] = useState(null);

  const fin_query = db
    .collection("u_dq_finishes")
    .where("u_email", "==", getAuth().currentUser.email)
    .where("dq_id", "==", quest_id);

  const [data, isDataLoading] = useCollectionData(fin_query);
  const count = data && Object.keys(data).length;

  useEffect(() => {
    if (count !== 0 && !isDataLoading) {
      setVerdict(Object.values(data)[0].verdict);
      setAnswer(Object.values(data)[0].answer);
    }
  }, [data]);

  ///// functions

  // modal for admin
  const [openView, setOpenView] = useState(false);

  // add to db function

  const addtoDB = (flag, pts1, pts2) => {
    const autoID = getAuth().currentUser.uid + "_" + quest_id;

    // new
    db.collection("u_dq_finishes")
      .doc(autoID)
      .set({
        dq_id: quest_id,
        u_email: getAuth().currentUser.email,
        answer: q_type === "" ? "" : q_type === "tf" ? String(tfVal) : mVal,
        verdict: flag,
      });

    // update user points
    db.collection("users").doc(getAuth().currentUser.email).update({
      overall_points: pts1,
      weekly_points: pts2,
    });

    if (q_type != "") {
      db.collection("users")
        .doc(getAuth().currentUser.email)
        .update({
          num_triv: num_triv + 1,
        });

      // first trivia badge
      if (num_triv === 0) {
        // new

        const modalData = {
          badge_idnum: 2,
          badge_title: "Daily Grind",
          badge_url: "https://i.imgur.com/OdHbnDZ.png",
          awardee: getAuth().currentUser.email,
        };

        var strJSON =
          '{"b' +
          modalData.badge_idnum +
          '":{"badge_title": "' +
          modalData.badge_title +
          '" ,"badge_url": "' +
          modalData.badge_url +
          '" ,"earner": "' +
          modalData.awardee +
          '" ,"earnedAt": ' +
          JSON.stringify(firebase.firestore.Timestamp.now().toDate()) +
          " }}";

        db.collection("u_badge_earns")
          .doc(getAuth().currentUser.email)
          .set(JSON.parse(strJSON), { merge: true });
      } else if (num_triv === 24) {
        // new

        const modalData = {
          badge_idnum: 12,
          badge_title: "Trivia Master",
          badge_url: "https://i.imgur.com/whOo3V4.png",
          awardee: getAuth().currentUser.email,
        };

        var strJSON =
          '{"b' +
          modalData.badge_idnum +
          '":{"badge_title": "' +
          modalData.badge_title +
          '" ,"badge_url": "' +
          modalData.badge_url +
          '" ,"earner": "' +
          modalData.awardee +
          '" ,"earnedAt": ' +
          JSON.stringify(firebase.firestore.Timestamp.now().toDate()) +
          " }}";

        db.collection("u_badge_earns")
          .doc(getAuth().currentUser.email)
          .set(JSON.parse(strJSON), { merge: true });
      } else if (num_triv === 49) {
        // new
        const modalData = {
          badge_idnum: 13,
          badge_title: "Quest Lover",
          badge_url: "https://i.imgur.com/sSQVcLF.png",
          awardee: getAuth().currentUser.email,
        };

        var strJSON =
          '{"b' +
          modalData.badge_idnum +
          '":{"badge_title": "' +
          modalData.badge_title +
          '" ,"badge_url": "' +
          modalData.badge_url +
          '" ,"earner": "' +
          modalData.awardee +
          '" ,"earnedAt": ' +
          JSON.stringify(firebase.firestore.Timestamp.now().toDate()) +
          " }}";

        db.collection("u_badge_earns")
          .doc(getAuth().currentUser.email)
          .set(JSON.parse(strJSON), { merge: true });
      }
    }
  };

  const onClaim = () => {
    const pts1 = oa_pts + pts;
    const pts2 = weekly_pts + pts;

    db.collection("users")
      .doc(getAuth().currentUser.email)
      .update({
        num_login: num_login + 1,
      });

    // first login badge
    if (num_login === 0) {
      // new
      const modalData = {
        badge_idnum: 1,
        badge_title: "Welcome to Pandemification!",
        badge_url: "https://i.imgur.com/q2cMXTp.png",
        awardee: getAuth().currentUser.email,
      };

      var strJSON =
        '{"b' +
        modalData.badge_idnum +
        '":{"badge_title": "' +
        modalData.badge_title +
        '" ,"badge_url": "' +
        modalData.badge_url +
        '" ,"earner": "' +
        modalData.awardee +
        '" ,"earnedAt": ' +
        JSON.stringify(firebase.firestore.Timestamp.now().toDate()) +
        " }}";

      db.collection("u_badge_earns")
        .doc(getAuth().currentUser.email)
        .set(JSON.parse(strJSON), { merge: true });
    }

    if (num_login === 14) {
      // new

      const modalData = {
        badge_idnum: 8,
        badge_title: "Perfect Attendance",
        badge_url: "https://i.imgur.com/mWO4qNb.png",
        awardee: getAuth().currentUser.email,
      };

      var strJSON =
        '{"b' +
        modalData.badge_idnum +
        '":{"badge_title": "' +
        modalData.badge_title +
        '" ,"badge_url": "' +
        modalData.badge_url +
        '" ,"earner": "' +
        modalData.awardee +
        '" ,"earnedAt": ' +
        JSON.stringify(firebase.firestore.Timestamp.now().toDate()) +
        " }}";

      db.collection("u_badge_earns")
        .doc(getAuth().currentUser.email)
        .set(JSON.parse(strJSON), { merge: true });
    }

    setNotifContent({
      imgURL:
        "https://www.meme-arsenal.com/memes/a3aa804a371b0df8b210e381507653d8.jpg",
      head: "Congratulations! You recieved " + pts + " points!",
      body: "Thank you for logging in. Keep doing it so that you can earn many points :)",
    });

    setOpenNotif(true);

    addtoDB(true, pts1, pts2);
  };

  // modal for true or false quest
  const [openTF, setOpenTF] = useState(false);

  const [tfVal, setTFVal] = useState(null);
  const [tfNull, setTFNull] = useState(true);

  const handleOpenTF = () => {
    setOpenTF(true);
    setTFVal(null);
    setTFNull(true);
  };

  const handleCloseTF = () => {
    setOpenTF(false);
  };

  const onSubmitTF = () => {
    if (tfVal !== null) {
      const res = tfVal === qAns;

      let pts1 = oa_pts + pts;
      let pts2 = weekly_pts + pts;

      if (!res) {
        pts1 = oa_pts;
        pts2 = weekly_pts;
      }

      addtoDB(res, pts1, pts2);
    } else {
      setTFNull(false);
    }
  };

  // modal for multiple choice

  const [openM, setOpenM] = useState(false);

  const [mVal, setMVal] = useState(null);
  const [mNull, setMNull] = useState(true);

  const handleOpenM = () => {
    setOpenM(true);
    setMVal(null);
    setMNull(true);
  };

  const handleCloseM = () => {
    setOpenM(false);
  };

  const onSubmitM = () => {
    if (mVal !== null) {
      const res = mVal === qAns;

      let pts1 = oa_pts + pts;
      let pts2 = weekly_pts + pts;

      if (!res) {
        pts1 = oa_pts;
        pts2 = weekly_pts;
      }

      addtoDB(res, pts1, pts2);
    } else {
      setMNull(false);
    }
  };

  function selectQuest() {
    if (q_type === "tf") {
      return (
        <>
          <Button variant="contained" onClick={handleOpenTF} size="small">
            {verdict === null ? "accept" : "view"}
          </Button>

          <Modal
            open={openTF}
            aria-labelledby="modal-modal-titletf"
            aria-describedby="modal-modal-descriptiontf"
          >
            <Box sx={style}>
              <Typography id="modal-modal-titletf" variant="h6" component="h2">
                <strong>Daily Quest: </strong>
                {q_name}
              </Typography>
              <Stack spacing={2}>
                <Typography
                  id="modal-modal-descriptiontf"
                  variant="body1"
                  sx={{ mt: 2 }}
                >
                  {q_details}
                  {imgURL != "" && (
                    <a href={imgURL} target="_blank">
                      <img src={imgURL} width="100%" />
                    </a>
                  )}
                </Typography>
                <RadioGroup row aria-label="tf" name="row-radio-buttons-group">
                  <FormControlLabel
                    value={true}
                    control={
                      <Radio
                        disabled={verdict !== null}
                        onClick={() => setTFVal(true)}
                      />
                    }
                    label="True"
                  />
                  <FormControlLabel
                    value={false}
                    control={
                      <Radio
                        disabled={verdict !== null}
                        onClick={() => setTFVal(false)}
                      />
                    }
                    label="False"
                  />
                </RadioGroup>

                {tfNull ? null : (
                  <Alert severity="error">
                    you can't submit without choosing your answer.
                  </Alert>
                )}

                {verdict === null ? (
                  <Button variant="outlined" onClick={onSubmitTF}>
                    Submit
                  </Button>
                ) : verdict === true ? (
                  <Alert severity="success">
                    You got it right! the answer is{" "}
                    <strong>{String(qAns)}</strong>. Rewards: {pts}!
                  </Alert>
                ) : (
                  <Alert severity="error">
                    You got it wrong sorry. the correct answer is{" "}
                    <strong>{String(qAns)}</strong>, while your answer is{" "}
                    {answer}.
                  </Alert>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCloseTF}
                >
                  Close
                </Button>
              </Stack>
            </Box>
          </Modal>
        </>
      );
    } else if (q_type === "mult") {
      return (
        <>
          <Button variant="contained" onClick={handleOpenM} size="small">
            {verdict === null ? "accept" : "view"}
          </Button>
          <Modal
            open={openM}
            aria-labelledby="modal-modal-titlem"
            aria-describedby="modal-modal-descriptionm"
          >
            <Box sx={style}>
              <Typography id="modal-modal-titlem" variant="h6" component="h2">
                <strong>Daily Quest: </strong>
                {q_name}
              </Typography>
              <Stack spacing={2}>
                <Typography
                  id="modal-modal-descriptionm"
                  variant="body1"
                  sx={{ mt: 2 }}
                >
                  {q_details}
                  {imgURL != "" && (
                    <a href={imgURL} target="_blank">
                      <img src={imgURL} width="100%" />
                    </a>
                  )}
                </Typography>
                <RadioGroup aria-label="m" name="row-radio-buttons-group">
                  <FormControlLabel
                    value="a"
                    control={
                      <Radio
                        disabled={verdict !== null}
                        onClick={() => setMVal("a")}
                      />
                    }
                    label={"a. " + qData[0]}
                  />
                  <FormControlLabel
                    value="b"
                    control={
                      <Radio
                        disabled={verdict !== null}
                        onClick={() => setMVal("b")}
                      />
                    }
                    label={"b. " + qData[1]}
                  />
                  <FormControlLabel
                    value="c"
                    control={
                      <Radio
                        disabled={verdict !== null}
                        onClick={() => setMVal("c")}
                      />
                    }
                    label={"c. " + qData[2]}
                  />
                  <FormControlLabel
                    value="d"
                    control={
                      <Radio
                        disabled={verdict !== null}
                        onClick={() => setMVal("d")}
                      />
                    }
                    label={"d. " + qData[3]}
                  />
                </RadioGroup>

                {mNull ? null : (
                  <Alert severity="error">
                    you can't submit without choosing your answer.
                  </Alert>
                )}

                {verdict === null ? (
                  <Button variant="outlined" onClick={onSubmitM}>
                    Submit
                  </Button>
                ) : verdict === true ? (
                  <Alert severity="success">
                    You got it right! the answer is <strong>{qAns}</strong>.
                    Rewards: {pts}!
                  </Alert>
                ) : (
                  <Alert severity="error">
                    You got it wrong sorry. The correct answer is{" "}
                    <strong>{qAns}</strong>, while your answer is {answer}.
                  </Alert>
                )}

                <Button variant="outlined" color="error" onClick={handleCloseM}>
                  Close
                </Button>
              </Stack>
            </Box>
          </Modal>
        </>
      );
    } else {
      return verdict === null ? (
        <Button variant="contained" onClick={onClaim} size="small">
          Claim
        </Button>
      ) : null;
    }
  }

  function selectIcon() {
    if (verdict === true) return <CheckBoxIcon />;
    else if (verdict === false) return <CancelPresentationIcon />;
    else return <CheckBoxOutlineBlankIcon />;
  }

  return (
    <>
      {data && !isDataLoading ? (
        <Stack
          direction="row"
          alignItems="center"
          padding={10 + "px"}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1}>
            {selectIcon()}
            <Typography variant="overline">
              <strong>{q_name}</strong> - {pts} pts
            </Typography>
          </Stack>
          {is_student === true ? (
            selectQuest(q_type)
          ) : (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenView(true)}
              >
                view data
              </Button>
              <Modal
                open={openView}
                onClose={() => setOpenView(false)}
                aria-labelledby="modal-modal-titleov"
                aria-describedby="modal-modal-descriptionov"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-titleov"
                    variant="h6"
                    component="h2"
                  >
                    <strong>Title: </strong>
                    {q_name}
                  </Typography>
                  <Stack spacing={2}>
                    <Typography>Type: {q_type}</Typography>
                    <Typography
                      id="modal-modal-descriptionov"
                      variant="body1"
                      sx={{ mt: 2 }}
                    >
                      details: {q_details}
                    </Typography>
                    {imgURL != "" && (
                      <a href={imgURL} target="_blank">
                        <img src={imgURL} width="100%" />
                      </a>
                    )}

                    <Typography>
                      Multiple Choice Data:{" "}
                      {qData.map((e, idx) => (
                        <Typography key={idx}>- {e}</Typography>
                      ))}
                    </Typography>
                    <Typography>Correct Answer: {String(qAns)}</Typography>
                    <Typography>
                      <strong>EXPIRATION</strong>
                    </Typography>
                    <Typography>{expiration} at 11:59 PM</Typography>
                  </Stack>
                </Box>
              </Modal>
            </>
          )}
        </Stack>
      ) : null}
    </>
  );
}

export default DQItem;

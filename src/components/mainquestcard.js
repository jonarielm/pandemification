import Stack from "@mui/material/Stack";

import ReactPlayer from "react-player";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";

import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LinkIcon from "@mui/icons-material/Link";

import { useState, useRef } from "react";

import { getAuth } from "firebase/auth";
import firebase from "../firebase";

import { useCollectionData } from "react-firebase-hooks/firestore";

const db = firebase.firestore();

function MainQuestCard({
  num_early,
  num_late,
  num_rev,
  qID,
  qRedirect,
  qTitle,
  qDetails,
  qContentURL,
  qPoints,
  qThumbnailURL,
  qWithDeadline,
  qDue,
  qDeadline,
  qCreatedAt,
  oa_pts,
  setOAPts,
  weekly_pts,
  setWeeklyPts,
  rank,
  setRank,
  is_student,
  mcProgress,
  setMCProgress,
  mcItem,
  setMCItem,
  setOpenNotif,
  setNotifContent,
}) {
  // check if finish

  const videoRef = useRef();

  const [videoEnded, setVideoEnded] = useState(false);
  const [videoProgress, setVideoProgress] = useState(
    qTitle === "Quest #3: [Watch] Lecture Video Part 3" ? 660 : 0
  );

  const handleProgress = (progress) => {
    if (
      progress.playedSeconds > videoProgress + 3 &&
      Object.keys(mq_finishes_data).length === 0
    ) {
      videoRef.current.seekTo(videoProgress, "seconds");
    } else if (progress.playedSeconds > videoProgress)
      setVideoProgress(progress.playedSeconds);

    if (videoProgress > videoRef.current.getDuration() - 45 && !videoEnded)
      setVideoEnded(true);
  };

  const [finish, setFinish] = useState(false);

  const mq_finishes_query = db
    .collection("u_mq_finishes")
    .where("mq_id", "==", qID)
    .where("u_email", "==", getAuth().currentUser.email);

  const [mq_finishes_data, is_loading] = useCollectionData(mq_finishes_query);

  // MQ MODAL
  const [openMQ, setOpenMQ] = useState(false);
  const handleOpenMQ = (val) => {
    setOpenMQ(true);
    if (Object.keys(mq_finishes_data).length === 1) {
      db.collection("users")
        .doc(getAuth().currentUser.email)
        .update({
          num_rev: num_rev + 1,
        });

      // first review badge
      if (num_rev === 0) {
        // new

        const modalData = {
          badge_idnum: 4,
          badge_title: "Study first!",
          badge_url: "https://i.imgur.com/meZcj46.png",
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
      } else if (num_rev === 4) {
        // new

        const modalData = {
          badge_idnum: 16,
          badge_title: "Study Cutie",
          badge_url: "https://i.imgur.com/jBVjVxn.png",
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
      } else if (num_rev === 14) {
        // new
        const modalData = {
          badge_idnum: 17,
          badge_title: "Study Nerd",
          badge_url: "https://i.imgur.com/kF94Low.png",
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
  const handleCloseMQ = () => {
    setOpenMQ(false);
  };

  // done quest handler
  const doneQuest = () => {
    qRedirect === true &&
      alert("This main quest will redirect you to your activity.");

    var deductions = 0;
    var numEarlyVal = 0;
    var numLateVal = 0;

    if (qWithDeadline === true) {
      if (firebase.firestore.Timestamp.now().toDate() <= qDue) {
        //early badge
        if (num_early === 4) {
          const modalData = {
            badge_idnum: 7,
            badge_title: "Early bird",
            badge_url: "https://i.imgur.com/RTNjokV.png",
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
        numEarlyVal = 1;
      } else {
        deductions = qPoints * 0.1;
        numLateVal = 1;
        //late badge
        if (num_late === 0) {
          const modalData = {
            badge_idnum: 10,
            badge_title: "Late or nothing",
            badge_url: "https://i.imgur.com/rXRQDea.png",
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
    }

    const earned_oa = oa_pts + qPoints - deductions;
    const earned_weekly = weekly_pts + qPoints - deductions;

    const autoID = getAuth().currentUser.uid + "_" + qID;

    // new
    db.collection("u_mq_finishes").doc(autoID).set({
      mq_id: qID,
      u_email: getAuth().currentUser.email,
      finishes_at: firebase.firestore.Timestamp.now(),
    });

    // update user points
    db.collection("users")
      .doc(getAuth().currentUser.email)
      .update({
        overall_points: earned_oa,
        weekly_points: earned_weekly,
        mq_progress: firebase.firestore.FieldValue.increment(1),
        numEarly: firebase.firestore.FieldValue.increment(numEarlyVal),
        numLateSub: firebase.firestore.FieldValue.increment(numLateVal),
      });

    // first main badge
    if (mcProgress === 0) {
      // new
      const modalData = {
        badge_idnum: 3,
        badge_title: "Bright Future!",
        badge_url: "https://i.imgur.com/ztXHitr.png",
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
    } else if (mcProgress === 4) {
      // new
      const modalData = {
        badge_idnum: 14,
        badge_title: "Goal Driven",
        badge_url: "https://i.imgur.com/HEoDNYc.png",
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
    } else if (mcProgress === 14) {
      // new
      const modalData = {
        badge_idnum: 15,
        badge_title: "Life Succesor",
        badge_url: "https://i.imgur.com/9ust0vF.png",
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
        "https://media.makeameme.org/created/yes-celebration-time-5ad253.jpg",
      head:
        "Congratulations! You recieved " + (qPoints - deductions) + " points!",
      body: "Keep on finishing the main questline to earn more rewards and be better at you class!",
    });

    setOpenNotif(true);
    setOpenMQ(false);
  };

  return (
    <>
      <div style={{ padding: 20 + "px" }}>
        <Stack>
          <Grid container>
            <Grid item xs={12}>
              <Paper style={{ padding: 20 + "px" }} elevation={3}>
                <Stack spacing={2}>
                  <Stack>
                    <Stack direction="row">
                      <Stack direction="row" alignItems="center" flexGrow={1}>
                        <Typography variant="body1">
                          <strong>{qTitle}</strong>
                        </Typography>
                      </Stack>

                      <Typography variant="overline">{qPoints} pts</Typography>
                    </Stack>

                    <Typography variant="caption">
                      <em>was posted {qCreatedAt}</em>
                    </Typography>

                    {qWithDeadline === true && (
                      <Stack direction="row" alignItems="center">
                        <Typography variant="caption">
                          <strong>until {qDeadline} at 11:59PM only</strong>
                        </Typography>

                        <Tooltip title="You may still take quest behind schedule but expect points reduction.">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </Stack>
                  <Divider />

                  <Grid container>
                    <Grid item xs={12} xl={6}>
                      <img
                        src={qThumbnailURL}
                        alt={qTitle}
                        width="100%"
                        height="100%"
                      />
                    </Grid>

                    <Grid item xs={12} xl={6} display="flex">
                      <Stack
                        spacing={2}
                        padding="15px"
                        justifyContent="space-between"
                        flexGrow={1}
                      >
                        <Typography variant="body2">{qDetails}</Typography>

                        {mq_finishes_data && !is_loading ? (
                          Object.keys(mq_finishes_data).length === 1 ||
                          finish === true ? (
                            qRedirect === false ? (
                              <Button
                                variant="outlined"
                                color="success"
                                onClick={handleOpenMQ}
                              >
                                Review Quest
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="success"
                                startIcon={<LinkIcon />}
                                href={qContentURL}
                                target="_blank"
                              >
                                Review Quest
                              </Button>
                            )
                          ) : qRedirect === false ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleOpenMQ}
                            >
                              Take Quest!
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<LinkIcon />}
                              onClick={doneQuest}
                              href={qContentURL}
                              target="_blank"
                            >
                              Take Quest!
                            </Button>
                          )
                        ) : null}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </div>

      <Dialog open={openMQ} maxWidth="xl" fullWidth={true}>
        <Stack padding="15px" spacing={2}>
          <Typography variant="caption">
            The content loaded below is taken from this link:-
            <a href={qContentURL} target="_blank" rel="noreferrer">
              {qContentURL}
            </a>
            <strong>
              You may click the link as you wish if the content fails to load.
            </strong>
          </Typography>

          {qContentURL.includes("youtube") ? (
            <ReactPlayer
              url={qContentURL}
              width="100%"
              height="700px"
              style={{ alignSelf: "center" }}
              controls={true}
              onProgress={handleProgress}
              ref={videoRef}
            />
          ) : (
            <iframe
              height="700px"
              src={qContentURL}
              title={qTitle}
              allow="fullscreen;"
            ></iframe>
          )}

          <Stack direction="row" spacing={2} justifyContent="center">
            {finish || (
              <>
                {is_student &&
                  mq_finishes_data &&
                  Object.keys(mq_finishes_data).length !== 1 && (
                    <Button
                      onClick={doneQuest}
                      variant="contained"
                      color="success"
                      sx={{ width: "250px" }}
                      disabled={!videoEnded && qContentURL.includes("youtube")}
                    >
                      DONE QUEST ({qPoints} pts)
                    </Button>
                  )}
              </>
            )}

            <Button
              onClick={handleCloseMQ}
              variant="contained"
              color="error"
              sx={{ width: "250px" }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}

export default MainQuestCard;

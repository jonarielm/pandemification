import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Hidden from "@mui/material/Hidden";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import StarRateIcon from "@mui/icons-material/StarRate";
import ArticleIcon from "@mui/icons-material/Article";

import { useState, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "../firebase";

import UserCard from "../components/usercard";
import DQCard from "../components/dq_card";
import MainQuestLine from "../components/mainquestline";
import AddModalForm from "../components/add_modal_form";

const db = firebase.firestore();
function Dashboard({ user_val, setOpenNotif, setNotifContent }) {
  const user_data = {
    is_student: user_val.is_student,
    overall_pts: user_val.overall_points,
    weekly_pts: user_val.weekly_points,
    mq_progress: user_val.mq_progress,
    rank: 0,
  };

  const [oa_pts, setOAPts] = useState(user_val.overall_points);
  const [weekly_pts, setWeeklyPts] = useState(user_val.weekly_points);
  const [rank, setRank] = useState(user_data.rank);

  const [proj_data, proj_loading] = useCollectionData(
    db.collection("projectData")
  );

  const [mcProgress, setMCProgress] = useState(user_val.mq_progress);
  const [mcItem, setMCItem] = useState(1);

  useEffect(() => {
    db.collection("projectData")
      .doc("mq")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setMCItem(doc.data().mq_count);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        alert(error);
      });

    setOAPts(user_val.overall_points);
    setWeeklyPts(user_val.weekly_points);
    setMCProgress(user_val.mq_progress);
  }, [user_val]);

  return (
    <div>
      <Grid container spacing={2} sx={{ padding: 5 + "px" }}>
        <Hidden lgDown>
          <Grid xl={1}></Grid>
        </Hidden>

        <Grid item xs={12} lg={3} xl={2}>
          <Stack spacing={1}>
            <Paper>
              <UserCard
                user_data={user_data}
                oa_pts={oa_pts}
                weekly_pts={weekly_pts}
                rank={rank}
                setRank={setRank}
              />
            </Paper>

            <Paper>
              <Stack padding="1rem" spacing={1}>
                <Typography variant="caption">
                  <strong>Rate Your Experience With Us</strong>
                </Typography>
                <Typography variant="caption">
                  Help us in our research by rating your experience with
                  Pandemification.
                </Typography>

                <Button
                  size="small"
                  startIcon={<StarRateIcon />}
                  href="https://forms.gle/GE4U5iKYWEEh396N9"
                  target="_blank"
                  style={{ justifyContent: "flex-start" }}
                >
                  Rate now
                </Button>
              </Stack>
            </Paper>
            <Paper>
              <Stack padding="1rem" spacing={1}>
                <Typography variant="caption">
                  <strong>Learning Test</strong>
                </Typography>
                <Typography variant="caption">
                  For your convenience, here is the link of the post-test about
                  the course CSDC102
                </Typography>

                <Button
                  size="small"
                  startIcon={<ArticleIcon />}
                  href="https://forms.gle/2NUVSQ4CacJkyugQ9"
                  target="_blank"
                  style={{ justifyContent: "flex-start" }}
                >
                  GO TO POST-TEST
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} md={12} lg={5}>
          <Paper>
            <Stack sx={{ padding: 15 + "px" }}>
              <Stack direction="row">
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  <strong>Main Quests</strong>
                </Typography>
                {user_data.is_student ? null : <AddModalForm mcItem={mcItem} />}
              </Stack>

              <Typography variant="overline">
                <strong>Main Quest Progress</strong> ({mcProgress} / {mcItem})
              </Typography>

              <LinearProgress
                variant="determinate"
                value={(mcProgress / mcItem) * 100}
                sx={{ height: "15px", borderRadius: "5px" }}
              />
            </Stack>

            <Divider />

            <MainQuestLine
              num_early={user_val.numEarly}
              num_late={user_val.numLateSub}
              num_rev={user_val.num_rev}
              is_student={user_data.is_student}
              oa_pts={oa_pts}
              setOAPts={setOAPts}
              weekly_pts={weekly_pts}
              setWeeklyPts={setWeeklyPts}
              rank={rank}
              setRank={setRank}
              mcProgress={mcProgress}
              setMCProgress={setMCProgress}
              mcItem={mcItem}
              setMCItem={setMCItem}
              setOpenNotif={setOpenNotif}
              setNotifContent={setNotifContent}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4} xl={3}>
          <Stack spacing={1}>
            <Paper>
              <Stack padding={5 + "px"} spacing={1}>
                <Stack>
                  <Typography variant="h6">Daily Quests</Typography>
                  <Typography variant="caption">
                    Resets every 12:00 AM
                  </Typography>
                </Stack>
                <Divider />
                <DQCard
                  num_login={user_val.num_login}
                  num_triv={user_val.num_triv}
                  is_student={user_data.is_student}
                  oa_pts={oa_pts}
                  setOAPts={setOAPts}
                  weekly_pts={weekly_pts}
                  setWeeklyPts={setWeeklyPts}
                  rank={rank}
                  setRank={setRank}
                  setOpenNotif={setOpenNotif}
                  setNotifContent={setNotifContent}
                />
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        <Hidden xlDown>
          <Grid xl={1}></Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default Dashboard;

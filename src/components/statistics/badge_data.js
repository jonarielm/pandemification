import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

//table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import firebase from "../../firebase";
const db = firebase.firestore();

function BadgeData() {
  const [genData, setGenData] = useState(null);

  //load once
  useEffect(() => {
    db.collection("projectData")
      .doc("stats_gen")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setGenData(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const update_gen_stats = () => {
    db.collection("users")
      .where("is_student", "==", true)
      .get()
      .then((querySnapshot) => {
        var total_user = 0;
        var total_p = 0;
        var arr_p = [];
        var total_login = 0;
        var total_mq = 0;
        var total_rev = 0;
        var total_dq = 0;

        var bViews = 0;
        var lbViews = 0;
        var nfViews = 0;

        var arrProg = [];

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          total_user = total_user + 1;
          total_p = total_p + doc.data().overall_points;
          total_login = total_login + doc.data().num_login;
          total_mq = total_mq + doc.data().mq_progress;
          total_rev = total_rev + doc.data().num_rev;
          total_dq = total_dq + doc.data().num_triv;
          arr_p.push(doc.data().overall_points);

          const arrProgData = {
            mq_progress: doc.data().mq_progress,
            email: doc.id,
          };
          arrProg.push(arrProgData);

          bViews += doc.data().badgePage;
          lbViews += doc.data().lbPage;
          nfViews += doc.data().nfPage;
        });

        arrProg.sort((a, b) => a.mq_progress - b.mq_progress);
        db.collection("projectData")
          .doc("stats_gen")
          .update({
            total_user: total_user,
            total_p: total_p,
            arr_p: arr_p,
            mean_p: total_p / total_user,
            sd_p: Math.sqrt(
              arr_p.reduce((s, n) => s + (n - total_p / total_user) ** 2, 0) /
                (arr_p.length - 1)
            ),
            userDataStats: [
              {
                name: "Total Login",
                val: total_login,
                avg: (total_login / total_user).toFixed(2),
              },
              {
                name: "Total Quest Done",
                val: total_mq,
                avg: (total_mq / total_user).toFixed(2),
              },
              {
                name: "Total Reviews",
                val: total_rev,
                avg: (total_rev / total_user).toFixed(2),
              },
              {
                name: "Total Trivias Answered",
                val: total_dq,
                avg: (total_dq / total_user).toFixed(2),
              },
            ],

            arrProg: arrProg.reverse(),

            lastUpdated: firebase.firestore.Timestamp.now(),
          });

        db.collection("projectData")
          .doc("page_stats")
          .update({
            totalBViews: bViews,
            totallbViews: lbViews,
            totalnfViews: nfViews,
            avgBViews: bViews / total_user,
            avglbViews: lbViews / total_user,
            avgnfViews: nfViews / total_user,

            lastUpdated: firebase.firestore.Timestamp.now(),
          });
        alert("general updated.");
      })
      .catch((error) => {
        alert("Error getting documents: ", error);
      });
  };

  return (
    <>
      {genData && (
        <Grid container>
          <Grid item xs={12} lg={6} padding="5px">
            <button onClick={update_gen_stats}>update</button>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Paper elevation={2}>
                <Stack padding="5px" textAlign="center">
                  <Typography variant="overline">Total Users:</Typography>
                  <Typography variant="h6">{genData.total_user}</Typography>
                </Stack>
              </Paper>
              <Paper elevation={2}>
                <Stack padding="5px" textAlign="center">
                  <Typography variant="overline">TOTAL P-POINTS</Typography>
                  <Typography variant="h6">{genData.total_p}</Typography>
                </Stack>
              </Paper>
              <Paper elevation={2}>
                <Stack padding="5px" textAlign="center">
                  <Typography variant="overline">MEAN P-POINTS</Typography>
                  <Typography variant="h6">
                    {genData.mean_p.toFixed(2)}
                  </Typography>
                </Stack>
              </Paper>
              <Paper elevation={2}>
                <Stack padding="5px" textAlign="center">
                  <Typography variant="overline">SD P-POINTS</Typography>
                  <Typography variant="h6">
                    {genData.sd_p.toFixed(2)}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>

            <Grid padding="10px">
              <Typography variant="body1" textAlign="center">
                <strong>Overall user participation performance</strong>
              </Typography>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={genData.arr_p.map((value, index) => ({
                    "user#": "user" + (index + 1),
                    "p-points": value,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="user#" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="p-points" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6} padding="10px">
            <Typography variant="body1" textAlign="center">
              <strong>User Stats</strong>
            </Typography>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart layout="vertical" data={genData.userDataStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="val" fill="#8884d8">
                  <LabelList dataKey="avg" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User email</TableCell>
                  <TableCell align="center">Main Quest Done</TableCell>
                  <TableCell align="center">Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {genData.arrProg &&
                  genData.arrProg.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.email}
                      </TableCell>
                      <TableCell align="center">{row.mq_progress}</TableCell>
                      <TableCell align="center">
                        {((row.mq_progress / 13) * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </>
  );
}

export default BadgeData;

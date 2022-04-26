import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useState, useEffect } from "react";
import firebase from "../firebase";
import { getAuth } from "firebase/auth";

const db = firebase.firestore();
let leaderboardsDBData = [];
let lastUpdated;

function Leaderboards({ is_student }) {
  let rank = 0;

  const [lbData, setLBData] = useState("OVERALL");

  const [data, setData] = useState(null);

  useEffect(() => {
    db.collection("users")
      .doc(getAuth().currentUser.email)
      .update({
        lbPage: firebase.firestore.FieldValue.increment(1),
      });

    //get leaderboards data at firestore

    db.collection("projectData")

      .doc("leaderboards")
      .get()
      .then((doc) => {
        if (doc.exists) {
          leaderboardsDBData = doc.data();
          lastUpdated = doc.data().lastUpdated.toDate().toString();
          setData(leaderboardsDBData.overall);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const handleLButton = () => {
    if (lbData === "OVERALL") {
      setLBData("WEEKLY");
      setData(leaderboardsDBData.weekly);
    } else {
      setLBData("OVERALL");
      setData(leaderboardsDBData.overall);
    }
  };

  const handleResetWeekly = () => {
    if (
      window.confirm(
        "Are you sure you want to reset weekly points? this cant be undone :<"
      )
    ) {
      db.collection("users")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.update({
              weekly_points: 0,
            });
          });
        });
    } else {
      // Do nothing!
      console.log("Thing was not saved to the database.");
    }
  };

  const handleUpdateLeaderboards = () => {
    db.collection("users")
      .where("is_student", "==", true)
      .orderBy("overall_points", "desc")
      .get()
      .then((querySnapshot) => {
        const snapShotData = querySnapshot.docs.map((doc) => doc.data());
        db.collection("projectData").doc("leaderboards").update({
          overall: snapShotData,
          lastUpdated: firebase.firestore.Timestamp.now(),
        });
      })
      .catch((error) => {
        alert(error);
      });
    db.collection("users")
      .where("is_student", "==", true)
      .orderBy("weekly_points", "desc")
      .get()
      .then((querySnapshot) => {
        const snapShotData = querySnapshot.docs.map((doc) => doc.data());
        db.collection("projectData").doc("leaderboards").update({
          weekly: snapShotData,
          lastUpdated: firebase.firestore.Timestamp.now(),
        });
      })
      .catch((error) => {
        alert(error);
      });
    alert("Update Success");
  };

  return (
    <Grid container padding="0.7rem" justifyContent="center">
      <Grid item xs={12} md={10} xl={8} maxHeight="70vh" overflow="auto">
        <Paper variant="outlined">
          <Stack padding="2rem" spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Leaderboards </Typography>

              <Typography variant="h6">{lbData}</Typography>

              <Stack spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleLButton}
                >
                  Show {lbData === "OVERALL" ? "WEEKLY" : "OVERALL"}
                </Button>

                {is_student === false && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleResetWeekly}
                  >
                    Reset Weekly Points
                  </Button>
                )}
              </Stack>

              {is_student === false && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleUpdateLeaderboards}
                >
                  Update Leaderboards
                </Button>
              )}
            </Stack>

            <Typography variant="overline" fontSize={10}>
              as of {lastUpdated}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell key={"Rank"} align="center">
                      <Typography variant="overline">
                        <strong>rank</strong>
                      </Typography>
                    </TableCell>

                    <TableCell key={"Name"} align="center">
                      <Typography variant="overline">
                        <strong>name</strong>
                      </Typography>
                    </TableCell>

                    <TableCell key={"Points"} align="center">
                      <Typography variant="overline">
                        <strong>{lbData} points</strong>
                      </Typography>
                    </TableCell>

                    <TableCell key={"Rewards"} align="center">
                      <Typography variant="overline">
                        <strong>Rewards</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data &&
                    data.map((users, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="right">
                          <Typography variant="overline">
                            {idx === 0
                              ? (rank = rank + 1)
                              : lbData === "OVERALL"
                              ? Object.values(data)[idx - 1].overall_points ===
                                users.overall_points
                                ? rank
                                : (rank = rank + 1)
                              : Object.values(data)[idx - 1].weekly_points ===
                                users.weekly_points
                              ? rank
                              : (rank = rank + 1)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="overline">
                            {users.u_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="overline">
                            {lbData === "OVERALL"
                              ? users.overall_points
                              : users.weekly_points}
                          </Typography>
                        </TableCell>
                        {lbData === "OVERALL" && (
                          <TableCell align="left">
                            {rank === 1 && (
                              <Badge color="secondary" badgeContent={0}>
                                <Tooltip title="King of Pandemification" arrow>
                                  <Avatar src="https://i.imgur.com/7dgOdvv.png" />
                                </Tooltip>
                              </Badge>
                            )}
                            {rank === 2 && (
                              <Badge color="secondary" badgeContent={0}>
                                <Tooltip
                                  title="Prince of Pandemification"
                                  arrow
                                >
                                  <Avatar src="https://i.imgur.com/OlafEtH.png" />
                                </Tooltip>
                              </Badge>
                            )}
                            {rank === 3 && (
                              <Badge color="secondary" badgeContent={0}>
                                <Tooltip
                                  title="Knight of Pandemification"
                                  arrow
                                >
                                  <Avatar src="https://i.imgur.com/XwK3Gve.png" />
                                </Tooltip>
                              </Badge>
                            )}
                          </TableCell>
                        )}
                        {lbData === "WEEKLY" && (
                          <TableCell align="left">
                            {rank === 1 && (
                              <Badge color="secondary" badgeContent={0}>
                                <Tooltip title="Apex" arrow>
                                  <Avatar src="https://i.imgur.com/39pKz00.png" />
                                </Tooltip>
                              </Badge>
                            )}
                            {rank === 2 && (
                              <Badge color="secondary" badgeContent={0}>
                                <Tooltip title="Uncrowned King" arrow>
                                  <Avatar src="https://i.imgur.com/GG4yKK5.png" />
                                </Tooltip>
                              </Badge>
                            )}
                            {rank === 3 && (
                              <Badge color="secondary" badgeContent={0}>
                                <Tooltip title="Thrill Seeker" arrow>
                                  <Avatar src="https://i.imgur.com/3sW9ijb.png" />
                                </Tooltip>
                              </Badge>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Leaderboards;

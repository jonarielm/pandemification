import Grid from "@mui/material/Grid";

//table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import firebase from "../../firebase";
import { useEffect, useState } from "react";
const db = firebase.firestore();

function MainStats() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    db.collection("projectData")
      .doc("main_stats")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setRows(
            doc.data().main_quests.sort((a, b) => a.createdAt - b.createdAt)
          );
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const getMainStats = () => {
    db.collection("mainQuests")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          var finish = 0;
          var earliest = null;
          var total_days = 0;
          var createdAt = doc.data().createdAt;

          db.collection("projectData").doc("main_stats").set({
            main_quests: [],
          });

          db.collection("u_mq_finishes")
            .where("mq_id", "==", doc.id)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                finish += 1;
                var timeDif =
                  doc.data().finishes_at.toDate().getTime() -
                  createdAt.toDate().getTime();
                var dayDif = timeDif / (1000 * 3600 * 24);
                total_days += dayDif;

                if (earliest === null) earliest = doc.data().finishes_at;
                else if (doc.data().finishes_at < earliest)
                  earliest = doc.data().finishes_at;
              });

              db.collection("projectData")
                .doc("main_stats")
                .update({
                  main_quests: firebase.firestore.FieldValue.arrayUnion({
                    title: doc.data().title,
                    createdAt: createdAt,
                    finish: finish,
                    earliest: earliest,
                    avg_days: Math.round(total_days / finish),
                  }),
                });
            })
            .catch((error) => {
              alert("Error getting documents: ", error);
            });
        });
      })
      .catch((error) => {
        alert("Error getting documentzzs: ", error);
      });

    alert("success update main quest stats");
  };

  return (
    <>
      <button style={{ width: "100px" }} onClick={getMainStats}>
        get latest data
      </button>
      <Grid container>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Quest Title</TableCell>
                  <TableCell align="center">Date posted</TableCell>
                  <TableCell align="center">
                    No. of students who is done
                  </TableCell>
                  <TableCell align="center">Avg Days taken to finish</TableCell>
                  <TableCell align="center">Earliest Done</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell align="center">
                      {row.createdAt.toDate().toDateString()}
                    </TableCell>
                    <TableCell align="center">{row.finish}</TableCell>
                    <TableCell align="center">
                      {row.avg_days} day{row.avg_days > 1 && "s"}
                    </TableCell>
                    <TableCell align="center">
                      {row.earliest.toDate().toDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default MainStats;

import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from "recharts";

import firebase from "../../firebase";
const db = firebase.firestore();

function BadgeStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    db.collection("projectData")
      .doc("badge_stats")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setData(doc.data().badge_data);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const getBadgeData = () => {
    db.collection("u_badge_earns")
      .get()
      .then((querySnapshot) => {
        var badge_data = [
          { date: "March 29" },
          { date: "March 31" },
          { date: "April 2" },
          { date: "April 4" },
          { date: "April 6" },
          { date: "April 8" },
          { date: "April 10" },
          { date: "April 12" },
          { date: "April 14" },
          { date: "April 16" },
          { date: "April 18" },
          { date: "April 20" },
        ];

        var b1 = [];
        var b2 = [];
        var b3 = [];
        var b8 = [];
        var b12 = [];
        var b14 = [];
        var b16 = [];

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          doc.data().b1 &&
            b1.push({
              earnedAt: doc.data().b1.earnedAt,
            });

          doc.data().b2 &&
            b2.push({
              earnedAt: doc.data().b2.earnedAt,
            });

          doc.data().b3 &&
            b3.push({
              earnedAt: doc.data().b3.earnedAt,
            });

          doc.data().b8 &&
            b8.push({
              earnedAt: doc.data().b8.earnedAt,
            });

          doc.data().b12 &&
            b12.push({
              earnedAt: doc.data().b12.earnedAt,
            });
          doc.data().b14 &&
            b14.push({
              earnedAt: doc.data().b14.earnedAt,
            });
          doc.data().b16 &&
            b16.push({
              earnedAt: doc.data().b16.earnedAt,
            });
        });

        b1.sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));
        b2.sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));
        b3.sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));
        b8.sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));
        b12.sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));
        b14.sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));
        b16.sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));

        badge_data.map((val) => {
          b1.map((b) => {
            if (
              new Date(b.earnedAt) <= new Date(val.date + ", 2022 23:59:59")
            ) {
              val.hasOwnProperty("Welcome to Pandemification!")
                ? (val["Welcome to Pandemification!"] += 1)
                : (val["Welcome to Pandemification!"] = 1);
            }
          });
          b2.map((b) => {
            if (
              new Date(b.earnedAt) <= new Date(val.date + ", 2022 23:59:59")
            ) {
              val.hasOwnProperty("Daily Grind")
                ? (val["Daily Grind"] += 1)
                : (val["Daily Grind"] = 1);
            }
          });
          b3.map((b) => {
            if (
              new Date(b.earnedAt) <= new Date(val.date + ", 2022 23:59:59")
            ) {
              val.hasOwnProperty("Bright Future!")
                ? (val["Bright Future!"] += 1)
                : (val["Bright Future!"] = 1);
            }
          });
          b8.map((b) => {
            if (
              new Date(b.earnedAt) <= new Date(val.date + ", 2022 23:59:59")
            ) {
              val.hasOwnProperty("Perfect attendance")
                ? (val["Perfect attendance"] += 1)
                : (val["Perfect attendance"] = 1);
            }
          });
          b12.map((b) => {
            if (
              new Date(b.earnedAt) <= new Date(val.date + ", 2022 23:59:59")
            ) {
              val.hasOwnProperty("Trivia Master")
                ? (val["Trivia Master"] += 1)
                : (val["Trivia Master"] = 1);
            }
          });
          b14.map((b) => {
            if (
              new Date(b.earnedAt) <= new Date(val.date + ", 2022 23:59:59")
            ) {
              val.hasOwnProperty("Goal Driven")
                ? (val["Goal Driven"] += 1)
                : (val["Goal Driven"] = 1);
            }
          });
          b16.map((b) => {
            if (
              new Date(b.earnedAt) <= new Date(val.date + ", 2022 23:59:59")
            ) {
              val.hasOwnProperty("Study Cutie")
                ? (val["Study Cutie"] += 1)
                : (val["Study Cutie"] = 1);
            }
          });
        });

        db.collection("projectData").doc("badge_stats").set({
          badge_data: badge_data,
        });

        alert("success");
      })
      .catch((error) => {
        alert("Error getting documents: ", error);
      });
  };

  return (
    <>
      <Grid container>
        <button onClick={getBadgeData}>get Badge Stats</button>
        <Grid item xs={12} padding="15px">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart width={1000} height={500} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis>
                <Label angle={270} value={"Number of earners"} />
              </YAxis>
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Welcome to Pandemification!"
                stroke="#264653"
              />
              <Line type="monotone" dataKey="Daily Grind" stroke="#2a9d8f" />
              <Line type="monotone" dataKey="Bright Future!" stroke="#e9c46a" />
              <Line
                type="monotone"
                dataKey="Perfect attendance"
                stroke="#e76f51"
              />
              <Line type="monotone" dataKey="Trivia Master" stroke="#f72585" />
              <Line type="monotone" dataKey="Goal Driven" stroke="#ffc300" />
              <Line type="monotone" dataKey="Study Cutie" stroke="#718355" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default BadgeStats;

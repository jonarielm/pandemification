import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useEffect, useState } from "react";

import firebase from "../../firebase";
const db = firebase.firestore();

function PageStats() {
  const [pageStatsData, setPageStatsData] = useState(null);

  const data01 = pageStatsData && [
    { name: "Badge Page", value: pageStatsData.totalBViews },
    { name: "Leaderboards Page", value: pageStatsData.totallbViews },
    { name: "News Feed Page", value: pageStatsData.totalnfViews },
  ];

  useEffect(() => {
    db.collection("projectData")
      .doc("page_stats")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setPageStatsData(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  return (
    <>
      {pageStatsData && (
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} md={7} lg={9}>
                <Stack padding="15px" flex={1}>
                  <Typography variant="body1" textAlign="center">
                    <strong>PAGE VIEWS PIE CHART</strong>
                  </Typography>

                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={data01}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        fill="#8884d8"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5} lg={3}>
                <Stack spacing={1}>
                  <Paper elevation={2}>
                    <Stack padding="5px" textAlign="center">
                      <Typography variant="overline">
                        Total Badges Page Views
                      </Typography>
                      <Typography variant="h6">
                        {pageStatsData.totalBViews}
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper elevation={2}>
                    <Stack padding="5px" textAlign="center">
                      <Typography variant="overline">
                        Total Badge Page Average Views:
                      </Typography>
                      <Typography variant="h6">
                        {pageStatsData.avgBViews.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper elevation={2}>
                    <Stack padding="5px" textAlign="center">
                      <Typography variant="overline">
                        Total Leaderboards Page Views:
                      </Typography>
                      <Typography variant="h6">
                        {pageStatsData.totallbViews}
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper elevation={2}>
                    <Stack padding="5px" textAlign="center">
                      <Typography variant="overline">
                        Total Leaderboards Page Average Views:
                      </Typography>
                      <Typography variant="h6">
                        {pageStatsData.avglbViews.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper elevation={2}>
                    <Stack padding="5px" textAlign="center">
                      <Typography variant="overline">
                        Total News Feed Page Views:
                      </Typography>
                      <Typography variant="h6">
                        {pageStatsData.totalnfViews}
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper elevation={2}>
                    <Stack padding="5px" textAlign="center">
                      <Typography variant="overline">
                        Total News Feed Page Average Views:
                      </Typography>
                      <Typography variant="h6">
                        {pageStatsData.avgnfViews.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default PageStats;

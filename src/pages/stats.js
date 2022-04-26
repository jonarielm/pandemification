import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import { useState } from "react";

// components
import BadgeData from "../components/statistics/badge_data";
import PageStats from "../components/statistics/page_stats";
import MainStats from "../components/statistics/main_stats";
import BadgeStats from "../components/statistics/badge_stats";

function WebStats() {
  return (
    <Grid container padding="10px" justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Paper elevation={0}>
          <Stack padding="10px" spacing={1}>
            <Typography variant="body1">
              <strong>General</strong>
            </Typography>
            <BadgeData />
            <Divider />
            <Typography variant="body1">
              <strong>Page Views</strong>
            </Typography>
            <PageStats />
            <Divider />

            <Typography variant="body1">
              <strong>Main Quests</strong>
            </Typography>
            <MainStats />
            <Divider />

            <Typography variant="body1">
              <strong>Badges</strong>
            </Typography>
            <BadgeStats />
            <Divider />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default WebStats;

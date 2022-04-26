import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import TextField from "@mui/material/TextField";
import { useState } from "react";

import firebase from "../../firebase";

const db = firebase.firestore();

function MainQuestForm({ handleCloseModalQuest, mcItem }) {
  const [redirect, setRedirect] = useState(null);
  const [mcTitle, setMCTitle] = useState("");
  const [mcDetails, setMCDetails] = useState("");
  const [mcContentURL, setMCContentURL] = useState("");
  const [mcThumbnailURL, setMCThumbnailURL] = useState("");
  const [mcPoints, setMCPoints] = useState(NaN);
  const [mcDeadline, setMCDeadline] = useState(null);

  const handleDeadlineChange = (e) => {
    if (e !== null) {
      e.setHours(23, 59, 0, 0);
      setMCDeadline(e);
    }
  };

  const handleSubmit = () => {
    if (redirect === null) {
      alert("redirect empty put value plz.");
      return;
    }

    if (mcTitle === "") {
      alert("Main Quest Title is Empty");
      return;
    }

    if (mcDetails === "") {
      alert("Main Quest Detail is Empty");
      return;
    }

    if (mcContentURL === "") {
      alert("Main Quest Content URL is Empty");
      return;
    }

    if (mcThumbnailURL === "") {
      alert("Main Quest Thumbnail URL is Empty");
      return;
    }

    if (isNaN(mcPoints)) {
      alert("Assigned Point is not a number");
      return;
    }

    const withDeadline = mcDeadline !== null;

    const today2022 = firebase.firestore.Timestamp.now().toDate();
    today2022.setFullYear(today2022.getFullYear() + 1);

    db.collection("mainQuests").add({
      redirect: redirect,
      title: mcTitle,
      details: mcDetails,
      contentURL: mcContentURL,
      thumbnailURL: mcThumbnailURL,
      points: mcPoints,
      withDeadline: withDeadline,
      deadline: withDeadline
        ? firebase.firestore.Timestamp.fromDate(mcDeadline)
        : firebase.firestore.Timestamp.fromDate(today2022),
      createdAt: firebase.firestore.Timestamp.now(),
    });

    db.collection("projectData")
      .doc("mq")
      .update({
        mq_count: firebase.firestore.FieldValue.increment(1),
      });

    alert("SUCCESS ADDING!");
    handleCloseModalQuest();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6"> Add Main Quest Form</Typography>
        <IconButton onClick={handleCloseModalQuest}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Typography variant="caption">
        <strong>*NOTE:</strong> Closing this form will lose progress.
      </Typography>
      <Divider />

      <Stack sx={{ maxHeight: "55vh", overflow: "auto" }} spacing={1}>
        <Typography variant="overline">
          <strong>0. is with redirect quest?</strong>
        </Typography>
        <RadioGroup aria-label="type" name="row-radio-buttons-group">
          <FormControlLabel
            value={true}
            control={<Radio onClick={() => setRedirect(true)} />}
            label="True"
          />
          <FormControlLabel
            value={false}
            control={<Radio onClick={() => setRedirect(false)} />}
            label="False"
          />
        </RadioGroup>

        <Typography variant="overline">
          <strong>1. Main Quest Title: </strong>
        </Typography>
        <TextField
          label="Enter Main Quest Title"
          variant="filled"
          onChange={(e) => setMCTitle(e.target.value)}
        />

        <Typography variant="overline">
          <strong>2. Main Quest Details: </strong>
        </Typography>
        <TextField
          label="Enter Main Quest Details"
          multiline
          minRows={3}
          maxRows={5}
          variant="filled"
          onChange={(e) => setMCDetails(e.target.value)}
        />

        <Typography variant="overline">
          <strong>3. Main Quest Content URL: </strong>
        </Typography>
        <TextField
          label="Enter Main Quest Content URL"
          variant="filled"
          onChange={(e) => setMCContentURL(e.target.value)}
        />

        <Typography variant="overline">
          <strong>4. Main Quest Thumbnail URL: </strong>
        </Typography>
        <TextField
          label="Enter Main Quest Thumbnail URL"
          variant="filled"
          onChange={(e) => setMCThumbnailURL(e.target.value)}
        />

        <Typography variant="overline">
          <strong>5. Points for finishing</strong>
        </Typography>
        <TextField
          label="Assigned points as reward"
          variant="outlined"
          size="small"
          type="number"
          onChange={(e) => setMCPoints(e.target.valueAsNumber)}
        />

        <Typography variant="overline">
          <strong>6. Assign Deadline (Optional)</strong>
        </Typography>

        <TextField
          variant="outlined"
          size="small"
          type="date"
          onChange={(e) => handleDeadlineChange(e.target.valueAsDate)}
        />
      </Stack>

      <Divider />
      <Button variant="contained" onClick={handleSubmit}>
        Add Main Quest
      </Button>
      <Button variant="outlined" color="error" onClick={handleCloseModalQuest}>
        Cancel
      </Button>
    </Stack>
  );
}

export default MainQuestForm;

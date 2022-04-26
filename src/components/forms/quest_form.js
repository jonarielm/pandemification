import { useState } from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

// firebase
import firebase from "../../firebase";

const db = firebase.firestore();

function QuestForm({ handleCloseModalQuest }) {
  const [qType, setQType] = useState(null);
  const [qTitle, setQTitle] = useState(null);
  const [qTask, setQTask] = useState(null);
  const [imgURL, setImgURL] = useState("");

  // mult quest
  const [multA, setMultA] = useState(null);
  const [multB, setMultB] = useState(null);
  const [multC, setMultC] = useState(null);
  const [multD, setMultD] = useState(null);
  const [correctAns, setCorrectAns] = useState(null);

  const [qPoints, setQPoints] = useState(null);

  const [expiration, setExpiration] = useState(null);
  const handleExpirationChange = (e) => {
    if (e !== null) {
      e.setHours(23, 59, 0, 0);
      setExpiration(e);
    }
  };

  const handleAddQuest = () => {
    if (
      qType !== null &&
      qTitle !== null &&
      qTitle !== "" &&
      qTask !== null &&
      qTask !== "" &&
      qPoints !== null &&
      !isNaN(qPoints) &&
      expiration !== null
    ) {
      //code 1st if

      if (qType === "tf" || qType === "mult") {
        //code 2nd if

        if (qType === "mult") {
          //code 2.1 if

          if (
            multA !== null &&
            multA !== "" &&
            multB !== null &&
            multB !== "" &&
            multC !== null &&
            multC !== "" &&
            multD !== null &&
            multD !== ""
          ) {
            // code 2.1.1 if
          } else {
            alert("Fill up all multiple choices needed.");
            return;
          }
        }

        if (correctAns !== null) {
          // code 2.2 if
        } else {
          alert("Need correct answer key.");
          return;
        }
      }
    } else {
      alert("Form is not complete. Make sure you fill up everything.");
      return;
    }

    // code for adding to db

    db.collection("dailyQuests").add({
      correct_ans: qType !== "" ? correctAns : "",
      details: qTask,
      expiration: firebase.firestore.Timestamp.fromDate(expiration),
      mult_data: qType === "mult" ? [multA, multB, multC, multD] : [""],
      points: qPoints,
      title: qTitle,
      type: qType,
      imgURL: imgURL.match(/\.(jpeg|jpg|gif|png)$/) != null ? imgURL : "",
    });

    alert("SUCCESS ADDING!");
    handleCloseModalQuest();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6"> Add Quest Form</Typography>
        <IconButton onClick={handleCloseModalQuest}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Typography variant="caption">
        <strong>*NOTE:</strong> Closing this form will lose progress.
      </Typography>
      <Divider />

      <Stack sx={{ maxHeight: "55vh", overflow: "auto" }}>
        <Stack>
          <Typography variant="overline">
            <strong>1. Nature / type of quest:</strong>
          </Typography>
          <RadioGroup aria-label="type" name="row-radio-buttons-group">
            <FormControlLabel
              value=""
              control={<Radio onClick={() => setQType("")} />}
              label="Login Quest"
            />
            <FormControlLabel
              value="tf"
              control={<Radio onClick={() => setQType("tf")} />}
              label="True or False Quest"
            />
            <FormControlLabel
              value="mult"
              control={<Radio onClick={() => setQType("mult")} />}
              label="Multiple Choice Quest"
            />
          </RadioGroup>
        </Stack>

        <Stack>
          <Typography variant="overline">
            <strong>2. Quest Title: </strong>
          </Typography>
          <TextField
            label="Enter Quest Title"
            variant="filled"
            onChange={(e) => setQTitle(e.target.value)}
          />
        </Stack>

        <Stack>
          <Typography variant="overline">
            <strong>3. Quest Short Details: </strong>
          </Typography>
          <TextField
            label="Enter Short Quest Details"
            multiline
            minRows={2}
            maxRows={3}
            variant="filled"
            onChange={(e) => setQTask(e.target.value)}
          />
        </Stack>

        <Divider />

        {(qType === "tf" || qType === "mult") && (
          <Stack>
            <Typography variant="overline">
              <strong>3.1 Image URL: (optional)</strong>
            </Typography>
            <TextField
              label="Enter Quest Title"
              variant="filled"
              onChange={(e) => setImgURL(e.target.value)}
            />
            <a href={imgURL} target="_blank">
              <img src={imgURL} width="100%" />
            </a>
          </Stack>
        )}

        <Stack>
          {qType === "mult" ? (
            <Stack spacing={1}>
              <Typography variant="overline">
                <strong> Multiple Choices: </strong>
              </Typography>
              <TextField
                label="Choice A"
                variant="outlined"
                size="small"
                inputProps={{ maxlength: "100" }}
                onChange={(e) => setMultA(e.target.value)}
              />
              <TextField
                label="Choice B"
                variant="outlined"
                size="small"
                inputProps={{ maxlength: "100" }}
                onChange={(e) => setMultB(e.target.value)}
              />
              <TextField
                label="Choice C"
                variant="outlined"
                size="small"
                inputProps={{ maxlength: "100" }}
                onChange={(e) => setMultC(e.target.value)}
              />
              <TextField
                label="Choice D"
                variant="outlined"
                size="small"
                inputProps={{ maxlength: "100" }}
                onChange={(e) => setMultD(e.target.value)}
              />
            </Stack>
          ) : null}

          {qType === "tf" || qType === "mult" ? (
            <Typography variant="overline">
              <strong> Correct Answer</strong>
            </Typography>
          ) : null}

          {qType === "tf" ? (
            <RadioGroup row aria-label="tf" name="row-radio-buttons-group1">
              <FormControlLabel
                value={true}
                control={<Radio onClick={() => setCorrectAns(true)} />}
                label="True"
              />
              <FormControlLabel
                value={false}
                control={<Radio onClick={() => setCorrectAns(false)} />}
                label="False"
              />
            </RadioGroup>
          ) : null}

          {qType === "mult" ? (
            <RadioGroup row aria-label="tf" name="row-radio-buttons-group1">
              <FormControlLabel
                value="a"
                control={<Radio onClick={() => setCorrectAns("a")} />}
                label="A"
              />
              <FormControlLabel
                value="b"
                control={<Radio onClick={() => setCorrectAns("b")} />}
                label="B"
              />
              <FormControlLabel
                value="c"
                control={<Radio onClick={() => setCorrectAns("c")} />}
                label="C"
              />
              <FormControlLabel
                value="d"
                control={<Radio onClick={() => setCorrectAns("d")} />}
                label="D"
              />
            </RadioGroup>
          ) : null}
        </Stack>

        {qType !== null ? (
          <>
            <Typography variant="overline">
              <strong>4. Points for finishing the quest</strong>
            </Typography>
            <TextField
              label="Assigned points as reward"
              variant="outlined"
              size="small"
              type="number"
              onChange={(e) => setQPoints(e.target.valueAsNumber)}
            />

            <Typography variant="overline">
              <strong>5. Quest expiration date</strong>
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              type="date"
              onChange={(e) => handleExpirationChange(e.target.valueAsDate)}
            />
          </>
        ) : null}
      </Stack>

      <Divider />
      <Button variant="contained" onClick={handleAddQuest}>
        Add Quest
      </Button>
      <Button variant="outlined" color="error" onClick={handleCloseModalQuest}>
        Cancel
      </Button>
    </Stack>
  );
}

export default QuestForm;

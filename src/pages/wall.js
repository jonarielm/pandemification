import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import Divider from "@mui/material/Divider";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";

import { useState, useEffect } from "react";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { getAuth } from "firebase/auth";
import firebase from "../firebase";
const db = firebase.firestore();

function Wall() {
  const [open, setOpen] = useState(false);
  const [imgURL, setImgURL] = useState("");
  const [post, setPost] = useState("");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("users")
      .doc(getAuth().currentUser.email)
      .update({
        nfPage: firebase.firestore.FieldValue.increment(1),
      });

    db.collection("post")
      .doc("sec1")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setPosts(
            Object.values(doc.data())
              .sort((a, b) => new Date(a.posted_at) - new Date(b.posted_at))
              .reverse()
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

  const handlePost = () => {
    if (post && post != "") {
      const post_id = firebase.firestore.Timestamp.now().toMillis();
      var strJSON =
        '{"' +
        post_id +
        '":{"poster_name": "' +
        getAuth().currentUser.displayName +
        '" ,"profile_pic": "' +
        getAuth().currentUser.photoURL +
        '" ,"post": "' +
        post +
        '" ,"post_id": "' +
        post_id +
        '" ,"img_url": "' +
        imgURL +
        '" ,"posted_at": ' +
        JSON.stringify(firebase.firestore.Timestamp.now().toDate()) +
        " }}";

      db.collection("post")
        .doc("sec1")
        .set(JSON.parse(strJSON), { merge: true });
    }
    setPost("");
    setImgURL("");
    db.collection("post")
      .doc("sec1")
      .get()
      .then((doc) => {
        if (doc.exists) {
          setPosts(
            Object.values(doc.data())
              .sort((a, b) => new Date(a.posted_at) - new Date(b.posted_at))
              .reverse()
          );
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  function handleRemovePost(post_id) {
    if (
      window.confirm(
        "Are you sure you wish to remove this post " + post_id + "? "
      )
    ) {
      db.collection("post")
        .doc("sec1")
        .update({
          [post_id]: firebase.firestore.FieldValue.delete(),
        });

      db.collection("post")
        .doc("sec1")
        .get()
        .then((doc) => {
          if (doc.exists) {
            setPosts(
              Object.values(doc.data())
                .sort((a, b) => new Date(a.posted_at) - new Date(b.posted_at))
                .reverse()
            );
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  const handleClose = () => {};

  return (
    <Grid container justifyContent="center" padding="0.5rem">
      <Grid item xs={12} md={6} lg={5}>
        <Paper elevation={3}>
          <Stack padding="0.5rem">
            <Stack padding="0.5rem" spacing="0.3rem">
              <TextField
                label="Write something..."
                multiline
                minRows={4}
                maxRows={4}
                variant="standard"
                value={post}
                inputProps={{ maxLength: 280 }}
                onChange={(e) => setPost(e.target.value)}
              />

              <img
                src={imgURL}
                style={{ alignSelf: "center", maxWidth: "250px" }}
              />

              <Stack direction="row-reverse" justifyContent="space-between">
                <Button
                  variant="contained"
                  size="small"
                  sx={{ width: 150 }}
                  onClick={handlePost}
                >
                  POST
                </Button>
                <IconButton onClick={() => setOpen(true)} size="small">
                  <AttachFileIcon />
                </IconButton>
              </Stack>
            </Stack>

            <Stack padding="1.5rem" spacing="1rem">
              {posts.length != 0 ? (
                posts.map((data) => (
                  <div key={data.post_id}>
                    <Stack padding="1rem" spacing="0.5rem">
                      <Stack direction="row" spacing="1rem">
                        <Avatar
                          alt="Avatar"
                          src={data.profile_pic}
                          sx={{ width: "2rem", height: "2rem" }}
                        />
                        <Stack flex={1}>
                          <Typography variant="subtitle">
                            {data.poster_name}
                          </Typography>
                          <Typography variant="caption">
                            <i>
                              posted{" "}
                              {new Date(data.posted_at).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </i>
                          </Typography>
                        </Stack>

                        {getAuth().currentUser.displayName ===
                          data.poster_name && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemovePost(data.post_id)}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        )}
                      </Stack>

                      <Typography variant="caption" padding="0.5rem">
                        {data.post}
                      </Typography>
                      <a
                        href={data.img_url}
                        target="_blank"
                        style={{ textAlign: "center" }}
                      >
                        <img src={data.img_url} width="80%" />
                      </a>
                    </Stack>

                    <Divider />
                  </div>
                ))
              ) : (
                <Typography variant="caption">
                  Looks like someone is not yet posting. Share something good or
                  weird.
                </Typography>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <Stack minWidth="25rem" padding="1rem" spacing="1rem">
          <Typography variant="caption">Insert meme or etc</Typography>
          <TextField
            variant="outlined"
            label="paste image link here, eg. https://mymeme.png"
            value={imgURL}
            onChange={(e) => setImgURL(e.target.value)}
          ></TextField>

          <img
            src={imgURL}
            style={{ alignSelf: "center", maxWidth: "250px" }}
          />

          <Button variant="outlined" onClick={() => setOpen(false)}>
            Done
          </Button>
        </Stack>
      </Dialog>
    </Grid>
  );
}

export default Wall;

// material UI stuffs
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import GoogleIcon from "@mui/icons-material/Google";
import Avatar from "@mui/material/Avatar";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// firebase auth
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login({ isInvited }) {
  function signInWithGoogle() {
    if (isInvited === false) getAuth().signOut();

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    signInWithPopup(getAuth(), provider).catch((err) => {
      console.log("err code: " + err.code + ", err msg: " + err.message);
    });
  }

  return (
    <div>
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
          sx={{
            backgroundImage: 'url("https://i.imgur.com/vHomn3F.jpg")',
            minHeight: "35rem",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
          }}
        >
          <Box
            sx={{
              marginTop: "12rem",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              flexWrap: "wrap",
            }}
          >
            <Stack>
              <Typography
                variant="h5"
                color="whitesmoke"
                sx={{ textShadow: "1px 1px black" }}
              >
                Welcome to <strong>Pandemification </strong>
              </Typography>
              <Stack spacing={2}>
                <Typography
                  variant="p"
                  color="whitesmoke"
                  sx={{ textShadow: "1px 1px black" }}
                >
                  Online learning made fun!
                </Typography>

                <Button
                  onClick={() => signInWithGoogle()}
                  variant="contained"
                  color="error"
                  startIcon={<GoogleIcon />}
                >
                  Sign In With GBOX
                </Button>

                {isInvited === false ? (
                  <Alert severity="error">
                    <AlertTitle>Access Denied</AlertTitle>
                    This web app is for invite only. Contact
                    jmaravilla@gbox.adnu.edu.ph if you think this is a mistake.
                  </Alert>
                ) : null}
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2} padding="1rem">
            <Typography variant="h5" textAlign="center">
              About
            </Typography>

            <Stack alignItems="center" spacing={2} padding="1rem">
              <iframe
                width="80%"
                height="400rem"
                src="https://www.youtube.com/embed/_x3BdJQ3-a8"
                title="YouTube video player"
              ></iframe>

              <Typography variant="body1">
                Pandemification is a gamification platform that helps students
                in their online learning during the Covid-19 Pandemic. It
                transform the online materials provided by the teachers into a
                quest like experience.
              </Typography>
            </Stack>

            <Typography variant="h5" textAlign="center">
              {" "}
              The Team
            </Typography>

            <Grid container>
              <Grid xs={12} lg={4} item>
                <Stack alignItems="center">
                  <Avatar alt="Jon Ariel N. Maravilla" src="" />
                  <Typography variant="overline">
                    <strong>Jon Ariel Maravilla</strong>
                  </Typography>
                  <Typography variant="caption">
                    jmaravilla@gbox.adnu.edu.ph
                  </Typography>
                  <Typography variant="caption">
                    BS Computer Science, ADNU
                  </Typography>
                </Stack>
              </Grid>
              <Grid xs={12} lg={4} item>
                <Stack alignItems="center">
                  <Avatar alt="Prince Bernie Colis" src="" />
                  <Typography variant="overline">
                    <strong>Prince Bernie Colis</strong>
                  </Typography>
                  <Typography variant="caption">
                    pbcolis@gbox.adnu.edu.ph
                  </Typography>
                  <Typography variant="caption">
                    BS Computer Science, ADNU
                  </Typography>
                </Stack>
              </Grid>
              <Grid xs={12} lg={4} item>
                <Stack alignItems="center">
                  <Avatar alt="Jeric Marx Natividad" src="" />
                  <Typography variant="overline">
                    <strong>Jeric Marx Natividad</strong>
                  </Typography>
                  <Typography variant="caption">
                    jmnatividad@gbox.adnu.edu.ph
                  </Typography>
                  <Typography variant="caption">
                    BS Computer Science, ADNU
                  </Typography>
                </Stack>
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="h5" textAlign="center">
              {" "}
              FAQs
            </Typography>

            <Stack spacing={2}>
              <Typography variant="body1">
                1. After signing in, it shows "not invited", why?
              </Typography>

              <Typography variant="body1">
                <strong> Answer: </strong>
                Currently, this web app is only available to selected students
                in ateneo. If you think you are invited but cant login, then
                please use ateneo GBOX account. If the problem still persist,
                contact any member in our team.
              </Typography>
            </Stack>

            <Divider />
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;

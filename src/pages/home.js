import { useEffect, useState } from "react";

//react router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// firebase hooks
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getAuth } from "firebase/auth";
import firebase from "../firebase";

// components
import Navbar from "../components/navbar";
import Dashboard from "./dashboard";
import Leaderboards from "./leaderboads";
import Badges from "./badges";
import Wall from "./wall";
import WebStats from "./stats";

import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const db = firebase.firestore();

const admins = [
  "jmaravilla@gbox.adnu.edu.ph",
  "pbcolis@gbox.adnu.edu.ph",
  "jmnatividad@gbox.adnu.edu.ph",
  "rgaray@gbox.adnu.edu.ph",
];

function Home() {
  //notif
  const [openNotif, setOpenNotif] = useState(false);
  const [notifContent, setNotifContent] = useState({
    imgURL: "",
    head: "",
    body: "",
  });

  // check user at firestore
  const usersRef = db.collection("users");
  const query = usersRef.where(
    firebase.firestore.FieldPath.documentId(),
    "==",
    getAuth().currentUser.email
  );

  // listen to change in user database table
  const [values, isloading] = useCollectionData(query);

  // check if user is registered. otherwise, register.

  useEffect(() => {
    db.collection("users")
      .doc(getAuth().currentUser.email)
      .get()
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          const stud_data = {
            u_name: getAuth().currentUser.displayName,
            is_student: !admins.includes(getAuth().currentUser.email),
            overall_points: 0,
            weekly_points: 0,
            mq_progress: 0,
            num_login: 0,
            num_triv: 0,
            num_rev: 0,
            numHighGrade: 0,
            numPerfect: 0,
            numEarly: 0,
            numComplete: 0,
            numCams: 0,
            numLateSub: 0,
            numBug: 0,
            numApex: 0,
            numUncrownedKing: 0,
            numWeeklyTriumphs: 0,
            numThrillSeeker: 0,
            numComment: 0,
            badgePage: 0,
            lbPage: 0,
            nfPage: 0,
          };
          console.log(stud_data);
          usersRef.doc(getAuth().currentUser.email).set(stud_data);
        }
      });
  }, [values]);

  return (
    <div>
      {values && !isloading && Object.keys(values).length !== 0 && (
        <Router basename={process.env.PUBLIC_URL}>
          <Navbar is_student={Object.values(values)[0].is_student} />
          <Switch>
            <Route exact path="/">
              <Dashboard
                user_val={Object.values(values)[0]}
                setOpenNotif={setOpenNotif}
                setNotifContent={setNotifContent}
              />
            </Route>
            <Route path="/leaderboards">
              <Leaderboards is_student={Object.values(values)[0].is_student} />
            </Route>

            <Route path="/badges">
              <Badges
                user_data={values[0]}
                email={getAuth().currentUser.email}
              />
            </Route>

            <Route path="/tripfeed">
              <Wall />
            </Route>

            {Object.values(values)[0].is_student === false ? (
              <Route path="/stats">
                <WebStats />
              </Route>
            ) : (
              <h1>Access Denied</h1>
            )}
          </Switch>
        </Router>
      )}

      <Dialog open={openNotif} maxWidth="sm" fullWidth={true}>
        <Stack padding="1rem" spacing={2}>
          <Stack alignItems="center">
            <img
              src={notifContent.imgURL}
              width="200rem"
              height="200rem"
              alt="nice!"
            />
            <Typography variant="body1">
              <strong>{notifContent.head}</strong>
            </Typography>
            <Typography variant="caption">{notifContent.body}</Typography>
          </Stack>

          <Button variant="contained" onClick={() => setOpenNotif(false)}>
            Okay
          </Button>
        </Stack>
      </Dialog>
    </div>
  );
}

export default Home;

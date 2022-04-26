import "./App.css";

//initializing firebase config
import "./firebase";

// firebase auth
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// mui stuffs
import LinearProgress from "@mui/material/LinearProgress";

//pages
import Home from "./pages/home";
import Login from "./pages/login";

let emails = [
  "jmaravilla@gbox.adnu.edu.ph",
  "pbcolis@gbox.adnu.edu.ph",
  "jmnatividad@gbox.adnu.edu.ph",
  "rgaray@gbox.adnu.edu.ph",
  "jlagapito@gbox.adnu.edu.ph",
  "mnalden@gbox.adnu.edu.ph",
  "meantonio@gbox.adnu.edu.ph",
  "wjbagaporo@gbox.adnu.edu.ph",
  "gbesmano@gbox.adnu.edu.ph",
  "jbitara@gbox.adnu.edu.ph",
  "mcadag@gbox.adnu.edu.ph",
  "jcaperina@gbox.adnu.edu.ph",
  "eesperida@gbox.adnu.edu.ph",
  "bferrer@gbox.adnu.edu.ph",
  "rgases@gbox.adnu.edu.ph",
  "tgigantone@gbox.adnu.edu.ph",
  "rhermocilla@gbox.adnu.edu.ph",
  "aimperial@gbox.adnu.edu.ph",
  "dluces@gbox.adnu.edu.ph",
  "jammariano@gbox.adnu.edu.ph",
  "snacional@gbox.adnu.edu.ph",
  "lmomilig@gbox.adnu.edu.ph",
  "jipanganiban@gbox.adnu.edu.ph",
  "vpasco@gbox.adnu.edu.ph",
  "jpelago@gbox.adnu.edu.ph",
  "kperez@gbox.adnu.edu.ph",
  "jquerubin@gbox.adnu.edu.ph",
  "ckquidip@gbox.adnu.edu.ph",
  "arafallo@gbox.adnu.edu.ph",
  "srecepcioniii@gbox.adnu.edu.ph",
  "shrosales@gbox.adnu.edu.ph",
  "tsabanal@gbox.adnu.edu.ph",
  "mtalagtag@gbox.adnu.edu.ph",
  "dturiano@gbox.adnu.edu.ph",
  "wzenit@gbox.adnu.edu.ph",
];

function App() {
  // to check if theres a current login user
  const [user, isLoading] = useAuthState(getAuth());

  // for debug line, comment to check invited users
  //const user_check = true;

  // uncomment to allow user checking
  const user_check =
    user && emails && emails.includes(getAuth().currentUser.email);

  return (
    <div className="App">
      {isLoading ? (
        <LinearProgress />
      ) : user ? (
        user_check ? (
          <Home />
        ) : (
          <Login isInvited={emails.includes(getAuth().currentUser.email)} />
        )
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;

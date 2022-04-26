import Stack from "@mui/material/Stack";
import DQItem from "./dq_item";

import firebase from "../firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

const db = firebase.firestore();
let today = firebase.firestore.Timestamp.now();

// uncomment dq_query for daily quest

let dq_query = db
  .collection("dailyQuests")
  .where("expiration", ">", today)
  .orderBy("expiration")
  .orderBy("points");

// for debug cooment if not
//let dq_query = db.collection("dailyQuests").orderBy("points");

function DQCard({
  num_triv,
  num_login,
  is_student,
  oa_pts,
  setOAPts,
  weekly_pts,
  setWeeklyPts,
  rank,
  setRank,
  setOpenNotif,
  setNotifContent,
}) {
  // returns all available daily quest today

  const [quests] = useCollectionDataOnce(dq_query, { idField: "id" });

  return (
    <Stack spacing={2}>
      {quests &&
        quests.map((quest) => (
          <DQItem
            key={quest.id}
            num_triv={num_triv}
            num_login={num_login}
            quest_id={quest.id}
            q_type={quest.type}
            q_name={quest.title}
            q_details={quest.details}
            imgURL={quest.imgURL}
            pts={quest.points}
            qData={quest.mult_data}
            qAns={quest.correct_ans}
            oa_pts={oa_pts}
            expiration={quest.expiration.toDate().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            setOAPts={setOAPts}
            weekly_pts={weekly_pts}
            setWeeklyPts={setWeeklyPts}
            rank={rank}
            setRank={setRank}
            is_student={is_student}
            setOpenNotif={setOpenNotif}
            setNotifContent={setNotifContent}
          />
        ))}
    </Stack>
  );
}

export default DQCard;

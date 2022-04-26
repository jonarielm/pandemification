import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import MainQuestCard from "./mainquestcard";
import { blueGrey } from "@mui/material/colors";

import firebase from "../firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

import { useEffect, useState } from "react";

const db = firebase.firestore();

function MainQuestLine({
  num_early,
  num_late,
  num_rev,
  is_student,
  oa_pts,
  setOAPts,
  weekly_pts,
  setWeeklyPts,
  rank,
  setRank,
  mcProgress,
  setMCProgress,
  mcItem,
  setMCItem,
  setOpenNotif,
  setNotifContent,
}) {
  let lastID = null;

  const setLastID = (val) => {
    lastID = val;
  };

  const [mainQuestsData, setMQData] = useState(null);

  const [mainQuestsQuery, setQuery] = useState(
    db.collection("mainQuests").orderBy("createdAt", "desc").limit(4)
  );

  const [mqData] = useCollectionDataOnce(mainQuestsQuery, {
    idField: "id",
  });

  const [loadMore, setLoadMore] = useState(false);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (
      !loadMore &&
      scrollHeight - scrollTop < clientHeight + clientHeight * 0.1
    ) {
      console.log("loaded");

      db.collection("mainQuests")
        .doc(lastID)
        .get()
        .then((docRef) => {
          setQuery(
            db
              .collection("mainQuests")
              .orderBy("createdAt", "desc")
              .startAfter(docRef)
              .limit(2)
          );
        });
      setLoadMore(true);
    }
  };

  useEffect(() => {
    if (mqData) {
      if (mainQuestsData === null) setMQData(mqData);
      else {
        setMQData([...mainQuestsData, ...mqData]);
      }
      setLoadMore(false);
    }
  }, [mqData]);

  return (
    <Stack
      sx={{
        maxHeight: "77vh",
        overflow: "auto",
        backgroundColor: blueGrey["50"],
      }}
      onScroll={handleScroll}
    >
      {mainQuestsData !== null &&
        mainQuestsData.map((data) => (
          <div key={data.id}>
            <MainQuestCard
              num_early={num_early}
              num_late={num_late}
              num_rev={num_rev}
              qID={data.id}
              qRedirect={data.redirect}
              qTitle={data.title}
              qDetails={data.details}
              qContentURL={data.contentURL}
              qPoints={data.points}
              qThumbnailURL={data.thumbnailURL}
              qWithDeadline={data.withDeadline}
              qDue={data.deadline.toDate()}
              qDeadline={data.deadline.toDate().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              qCreatedAt={data.createdAt.toDate().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              oa_pts={oa_pts}
              setOAPts={setOAPts}
              weekly_pts={weekly_pts}
              setWeeklyPts={setWeeklyPts}
              rank={rank}
              setRank={setRank}
              is_student={is_student}
              mcProgress={mcProgress}
              setMCProgress={setMCProgress}
              mcItem={mcItem}
              setMCItem={setMCItem}
              setOpenNotif={setOpenNotif}
              setNotifContent={setNotifContent}
            />
            <Divider />

            {setLastID(data.id)}
          </div>
        ))}
    </Stack>
  );
}
export default MainQuestLine;

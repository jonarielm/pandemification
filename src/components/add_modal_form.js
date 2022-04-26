import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import QuestForm from "./forms/quest_form";
import MainQuestForm from "./forms/main_quest_form";

import { useState } from "react";

const style = {
  position: "absolute",
  top: "80px",
  left: "35%",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
};

function AddModalForm({ mcItem }) {
  // =========== QUEST MODAL VARS
  const [whatForm, setWhatForm] = useState("");
  const [openModalQuest, setOpenModalQuest] = useState(false);

  const handleOpenModalQuest = (val) => {
    setOpenModalQuest(true);
    setWhatForm(val);
  };
  const handleCloseModalQuest = () => {
    setOpenModalQuest(false);
  };

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        icon={<SpeedDialIcon />}
        direction="left"
      >
        {/*---------------------------- DAILY QUEST ---------------------------------- */}
        <SpeedDialAction
          onClick={() => handleOpenModalQuest("dq")}
          icon={<FactCheckIcon />}
          tooltipTitle={"Add Daily Quest"}
        />
        <SpeedDialAction
          onClick={() => handleOpenModalQuest("mq")}
          icon={<MenuBookIcon />}
          tooltipTitle={"Add Main Quest"}
        />
      </SpeedDial>

      <Modal
        open={openModalQuest}
        aria-labelledby="modal-modal-title-quest"
        aria-describedby="modal-modal-description-quest"
      >
        <Box sx={style}>
          {whatForm === "mq" && (
            <MainQuestForm
              mcItem={mcItem}
              handleCloseModalQuest={handleCloseModalQuest}
            />
          )}
          {whatForm === "dq" && (
            <QuestForm handleCloseModalQuest={handleCloseModalQuest} />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default AddModalForm;

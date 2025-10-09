import React from "react";
import { PreviewSpecialtyPatientViewCards } from "./PreviewSpecialtyPatientViewCards.js";
import { useLoggedUser } from "../../../users/hooks/useLoggedUser.js";
export const PreviewCurrentUserPatientViewCards = () => {
  const {
    loggedUser
  } = useLoggedUser();
  console.log("loggedUser", loggedUser);
  return /*#__PURE__*/React.createElement("div", null, loggedUser?.id && /*#__PURE__*/React.createElement(PreviewSpecialtyPatientViewCards, {
    userId: loggedUser?.id
  }));
};
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { leaveRoomRequest } from "api/gameApi";
import { roomsUrl } from "utils/routes";

import useTelegram from "./useTelegram";

const useSetTelegramInterface = (navigateUrl?: string, userId?: number) => {
  const navigate = useNavigate();
  const { tg } = useTelegram();

  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      if (userId) {
        leaveRoomRequest(userId)
          .then((data) => {})
          .catch((error) => {
            console.log(error);
          });
      }
      navigateUrl && navigate(navigateUrl || roomsUrl);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }
  }, [tg, navigate, userId, navigateUrl]);
};

export default useSetTelegramInterface;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import { leaveRoomRequest } from "api/gameApi";

import { WebSocketContext } from "../socket/WebSocketContext";

import useTelegram from "./useTelegram";

const useSetTelegramInterface = (navigateUrl: string, userId?: number, roomId?: never) => {
  const navigate = useNavigate();
  const { tg } = useTelegram();
  const { sendMessage, wsmessages, disconnect } = useContext(WebSocketContext)!;

  useEffect(() => {
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      if (userId && roomId) {
        sendMessage({
          user_id: userId,
          room_id: roomId,
          type: 'kickplayer'
        });
      }
      navigateUrl && navigate(navigateUrl);
    });
    return () => {
      tg.BackButton.hide();
      tg.setHeaderColor('#d51845');
    }
  }, [tg, userId, navigateUrl]);
};

export default useSetTelegramInterface;

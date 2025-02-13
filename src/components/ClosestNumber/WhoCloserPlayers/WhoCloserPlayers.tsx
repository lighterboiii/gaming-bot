import { FC } from "react";

import { IPlayer } from "../../../utils/types/gameTypes";
import CaseEight from "../Eight/Eight";
import CaseFour from "../Five/Five";
import CaseThree from "../Four/Four";
import Case from '../One/CaseOne';
import CaseSeven from "../Seven/Seven";
import OneByOne from "../Single/Single";
import CaseSix from "../Six/Six";
import CaseTwo from "../Three/Three";

interface IProps {
  users: IPlayer[];
  playerEmojis: Record<number, string>;
}

const RenderComponent: FC<IProps> = ({ users, playerEmojis }) => {
  switch (users?.length) {
    case 1:
      return <OneByOne users={users} playerEmojis={playerEmojis} />;
    case 3:
      return <CaseTwo users={users} playerEmojis={playerEmojis} />;
    case 4:
      return <CaseThree users={users} playerEmojis={playerEmojis} />;
    case 5:
      return <CaseFour users={users} playerEmojis={playerEmojis} />;
    case 6:
      return <CaseSix users={users} playerEmojis={playerEmojis} />;
    case 7:
      return <CaseSeven users={users} playerEmojis={playerEmojis} />;
    case 8:
      return <CaseEight users={users} playerEmojis={playerEmojis} />;
    default:
      return <Case users={users} playerEmojis={playerEmojis} />
  }
};

export default RenderComponent;
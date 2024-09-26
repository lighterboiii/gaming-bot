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
}

const RenderComponent: FC<IProps> = ({ users }) => {
  switch (users?.length) {
    case 1:
      return <OneByOne users={users} />;
    case 3:
      return <CaseTwo users={users} />;
    case 4:
      return <CaseThree users={users} />;
    case 5:
      return <CaseFour users={users} />;
    case 6:
      return <CaseSix users={users} />;
    case 7:
      return <CaseSeven users={users} />;
    case 8:
      return <CaseEight users={users} />;
    default:
      return <Case users={users} />
  }
};

export default RenderComponent;
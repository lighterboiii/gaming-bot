/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import styles from './ChoiceBox.module.scss';
import rock from '../../../images/rock-paper-scissors/hands-icons/rock.png'
import rockDeselect from '../../../images/rock-paper-scissors/hands-icons/rock_deselect.png'
import rockSelect from '../../../images/rock-paper-scissors/hands-icons/rock_select.png'
import paper from '../../../images/rock-paper-scissors/hands-icons/paper.png'
import paperDeselect from '../../../images/rock-paper-scissors/hands-icons/paper_deselect.png'
import paperSelect from '../../../images/rock-paper-scissors/hands-icons/paper_select.png'
import scissors from '../../../images/rock-paper-scissors/hands-icons/scissors.png'
import scissorsDeselect from '../../../images/rock-paper-scissors/hands-icons/scissors_deselect.png'
import scissorsSelect from '../../../images/rock-paper-scissors/hands-icons/scissors_select.png'

interface IProps {
  handleChoice: (value: string) => void;
  choice?: string;
}

const ChoiceBox: FC<IProps> = ({ handleChoice, choice = '' }) => {
  const [choiceItem, setChoiceItem] = useState(choice);

  const onChoiceClick = (choice: string) => {
    handleChoice(choice);
    setChoiceItem(choice);
    
  };

  const getIconPath = (choice: string): string => {
    switch (choice) {
      case 'rock':
        return choiceItem === 'rock' ? rockSelect : choiceItem === '' ? rock : rockDeselect;
      case 'scissors':
        return choiceItem === 'scissors' ? scissorsSelect : choiceItem === '' ? scissors : scissorsDeselect;
      case 'paper':
        return choiceItem === 'paper' ? paperSelect : choiceItem === '' ? paper : paperDeselect;
      default:
        return '';
    }
  };

  return (
    <div className={styles.choiceBox}>
      <button
        type="button"
        className={styles.choiceBox__button}
        onClick={() => onChoiceClick('rock')}
      >
        <img
          src={getIconPath('rock')}
          alt="rock icon" className={styles.choiceBox__icon}
        />
      </button>
      <button
        type="button"
        className={styles.choiceBox__button}
        onClick={() => onChoiceClick('scissors')}
      >
        <img
          src={getIconPath('scissors')}
          alt="scissors icon"
          className={styles.choiceBox__icon}
        />
      </button>
      <button
        type="button"
        className={styles.choiceBox__button}
        onClick={() => onChoiceClick('paper')}
      >
        <img
          src={getIconPath('paper')}
          alt="paper icon"
          className={styles.choiceBox__icon}
        />
      </button>
    </div>
  )
};

export default ChoiceBox;
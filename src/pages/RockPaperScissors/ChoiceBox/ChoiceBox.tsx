/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from "react";
import styles from './ChoiceBox.module.scss';
import emoji_icon from '../../../images/rock-paper-scissors/emoji_icon.png';
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
  handleChoice: any;
}

const ChoiceBox: FC<IProps> = ({ handleChoice }) => {
  return (
    <div className={styles.choiceBox}>
      <button
        type="button"
        className={styles.choiceBox__button}
        onClick={() => handleChoice('rock')}
      >
        <img src={rock} alt="rock icon" className={styles.choiceBox__icon} />
      </button>
      <button
        type="button"
        className={styles.choiceBox__button}
        onClick={() => handleChoice('scissors')}
      >
        <img src={scissors} alt="scissors icon" className={styles.choiceBox__icon} />
      </button>
      <button
        type="button"
        className={styles.choiceBox__button}
        onClick={() => handleChoice('paper')}
      >
        <img src={paper} alt="paper icon" className={styles.choiceBox__icon} />
      </button>
      <button type="button" className={`${styles.choiceBox__button} ${styles.choiceBox__emojiButton}`}>
        <img src={emoji_icon} alt="emoji icon" className={styles.choiceBox__iconEmoji} />
      </button>
    </div>
  )
};

export default ChoiceBox;
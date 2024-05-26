// /* eslint-disable react-hooks/exhaustive-deps */
// import { FC, useEffect, useState } from 'react';
// import styles from './HandShake.module.scss';

// interface IProps {
//   prevChoices: { player1: string; player2: string };
//   userId?: any;
// }

// const HandShake: FC<IProps> = ({ prevChoices }) => {
//   const { player1, player2 } = prevChoices;
//   const [handImages, setHandImages] = useState({
//     leftHandImage: '',
//     rightHandImage: '',
//   });

//   useEffect(() => {
//     setHandImages({
//       leftHandImage: player1,
//       rightHandImage: player2,
//     });
//   }, [prevChoices]);

//   return (
//     <div className={styles.hands}>
//       <img
//         src={handImages.leftHandImage}
//         alt="left hand"
//         className={`${styles.hands__mainImage} ${styles.hands__leftMainImage}`}
//       />
//       <img
//         src={handImages.rightHandImage}
//         alt="right hand"
//         className={`${styles.hands__mainImage} ${styles.hands__rightMainImage}`}
//       />
//     </div>
//   );
// };

// export default HandShake;
import { FC, useEffect, useState } from 'react';
import styles from './HandShake.module.scss';

interface IProps {
  prevChoices: { player1: string; player2: string };
}

const HandShake: FC<IProps> = ({ prevChoices }) => {
  const { player1, player2 } = prevChoices;
  const [handImages, setHandImages] = useState({
    leftHandImage: '',
    rightHandImage: '',
  });
  const [prevHandImages, setPrevHandImages] = useState({
    leftHandImage: '',
    rightHandImage: '',
  });

  useEffect(() => {
    if (player1 !== prevHandImages.leftHandImage || player2 !== prevHandImages.rightHandImage) {
      setPrevHandImages({
        leftHandImage: player1,
        rightHandImage: player2,
      });
    }
  }, [player1, player2, prevHandImages]);

  useEffect(() => {
    if (prevHandImages.leftHandImage !== prevChoices.player1 || prevHandImages.rightHandImage !== prevChoices.player2) {
      setHandImages({
        leftHandImage: prevChoices.player1,
        rightHandImage: prevChoices.player2,
      });
    }
  }, [prevChoices, prevHandImages]);

  return (
    <div className={styles.hands}>
      <img
        src={handImages.leftHandImage}
        alt="left hand"
        className={`${styles.hands__mainImage} ${styles.hands__leftMainImage}`}
      />
      <img
        src={handImages.rightHandImage}
        alt="right hand"
        className={`${styles.hands__mainImage} ${styles.hands__rightMainImage}`}
      />
    </div>
  );
};

export default HandShake;

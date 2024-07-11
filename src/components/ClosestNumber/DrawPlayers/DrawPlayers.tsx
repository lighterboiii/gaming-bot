// /* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FC } from "react";

// import { IRPSPlayer } from "Utils/types/gameTypes";

// export const DrawAvatars: FC<{ drawPlayers: any, allPlayers: IRPSPlayer[] }> = ({ drawPlayers, allPlayers }) => {
//   const drawPlayerIds = Object.keys(drawPlayers);

//   const drawAvatars = allPlayers.filter(player => drawPlayerIds.includes(player.userid.toString())).map(player => (
//     <div key={player.userid} className={styles.avatarContainer}>
//       <img src={player.avatar} alt={`Avatar of ${player.username}`} className={styles.avatar} />
//     </div>
//   ));

//   return (
//     <div className={styles.drawAvatarsContainer}>
//       {drawAvatars}
//     </div>
//   );
// };
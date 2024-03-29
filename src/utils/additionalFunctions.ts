export function formatNumber(number: number) {
  const fixedNumber = number.toFixed(2);
  return fixedNumber.endsWith('.00') ? fixedNumber.slice(0, -3) : fixedNumber;
};

export const sortRooms = (rooms: any[], sortBy: string, ascending: boolean) => {
  return rooms.slice().sort((a, b) => {
    if (ascending) {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });
};


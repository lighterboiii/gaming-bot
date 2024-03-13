export const setDelay = (time: number) => {
  return new Promise((res) => setTimeout(res, time));
};
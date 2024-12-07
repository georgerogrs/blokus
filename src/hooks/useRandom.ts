export const useRandom = () => {
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  return { getRandomInt };
};

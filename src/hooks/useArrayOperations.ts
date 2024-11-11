export const useArrayOperations = () => {
  const arraysEqual = (a: number[], b: number[]) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const arrayInArray = (parent: number[][], child: number[]) => {
    let isMatch = false;
    parent.forEach((subArray) => {
      if (arraysEqual(subArray, child)) {
        isMatch = true;
      }
    });

    return isMatch;
  };

  return { arrayInArray };
};
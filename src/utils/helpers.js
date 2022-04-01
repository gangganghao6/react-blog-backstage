export const findLastIndex = (array, predicate) => {
  if (!array || !Array.isArray(array) || !array.length) {
    return;
  }
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
};

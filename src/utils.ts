export const isEqualObjects = (obj1: any, obj2: any): boolean => {
  // Check if both arguments are strictly equal
  if (obj1 === obj2) return true;

  // Check if both arguments are objects
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is different
  if (keys1.length !== keys2.length) return false;

  // Sort keys to ensure order does not matter
  keys1.sort();
  keys2.sort();

  // Compare keys and values recursively
  for (let key of keys1) {
    if (!keys2.includes(key) || !isEqualObjects(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const thousandSep = (number: number): string => {
  if (isNaN(number) || number === null || number === undefined) return "";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

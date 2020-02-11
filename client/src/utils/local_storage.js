export const getFromStorage = async (key) => {
  const result = await localStorage.getItem(key);
  return JSON.parse(result);
}

export const setInStorage = async (key, value) => {
  await localStorage.setItem(key, JSON.stringify(value));
}

export const removeFromStorage = async (key) => {
  await localStorage.removeItem(key);
}

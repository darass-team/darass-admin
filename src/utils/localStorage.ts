const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const getLocalStorage = (key: string): string => {
  const value = localStorage.getItem(key);

  if (typeof value === "string") return JSON.parse(value);
  else return "";
};

export const setLocalStorage = (key: string, value: any) => {
  try {
    const decycled = JSON.stringify(value, getCircularReplacer());

    return localStorage.setItem(key, decycled);
  } catch (error) {
    console.error(error);
  }
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

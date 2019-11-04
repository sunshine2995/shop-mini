export const isPhoneNumber = (value) => {
  return /^1\d{10}$/.test(value);
};

export const isBlank = (value) => {
  return /^\s*$/.test(value);
};

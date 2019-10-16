const isPhoneNumber = (value) => {
  return /^1\d{10}$/.test(value);
};

const isBlank = (value) => {
  return /^\s*$/.test(value);
};

export default {
  isPhoneNumber,
  isBlank,
};

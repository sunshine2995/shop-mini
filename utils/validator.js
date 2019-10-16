const isPhoneNumber = (value) => {
  return Boolean(value.match(/^1\d{10}$/));
};

const isBlank = (value) => {
  return Boolean(value.match(/^\s*$/));
};

export default {
  isPhoneNumber,
  isBlank,
};

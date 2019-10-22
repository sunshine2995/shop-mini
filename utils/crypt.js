function rotl(n, b) {
  return (n << b) | (n >>> (32 - b));
}

export function endian(n) {
  // If number given, swap endian
  if (n.constructor == Number) {
    return (rotl(n, 8) & 0x00ff00ff) | (rotl(n, 24) & 0xff00ff00);
  }
  for (let i = 0; i < n.length; i++) {
    n[i] = endian(n[i]);
  }
  return n;
}

export function bytesToWords(bytes) {
  const words = [];
  for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - (b % 32));
  }
  return words;
}

// Convert big-endian 32-bit words to a byte array
export function wordsToBytes(words) {
  const bytes = [];
  for (let b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - (b % 32))) & 0xff);
  }
  return bytes;
}

// Convert a byte array to a hex string
export function bytesToHex(bytes) {
  let hex = [];
  for (let i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16));
    hex.push((bytes[i] & 0xf).toString(16));
  }
  return hex.join('');
}

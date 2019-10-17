export function throttle(func, wait) {
  let lastCallTime = 0;

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    return timeSinceLastCall >= wait;
  }

  function throttled(...args) {
    const time = Date.now();

    if (shouldInvoke(time)) {
      func.call(this, args);
      lastCallTime = time;
    }
  }
  return throttled;
}

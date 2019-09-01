// Returns a function, that, as long as it continues to be invoked, will not
// be triggered
export default function debounce(func, waitTime) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, waitTime);
  };
}
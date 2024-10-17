export async function debounce(callback, delay) {
  let timeoutId;

  return function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  }
}

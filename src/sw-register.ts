if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const baseUrl = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/';
    navigator.serviceWorker.register(`${baseUrl}sw.js`).catch(() => {});
  });
}

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token header from the meta tag so axios POST/PUT/DELETE requests include it by default
const tokenMeta = document.querySelector('meta[name="csrf-token"]');
if (tokenMeta) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = tokenMeta.content;
}

// Ensure cookies are sent on same-origin requests (session cookie needed for CSRF validation)
window.axios.defaults.withCredentials = true;

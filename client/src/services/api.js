const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to make API calls with auth token
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    // Only set Content-Type to application/json if it's not already set 
    // and if we're not sending FormData (which shouldn't have a Content-Type header set manually)
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'API request failed');
    return data;
};

// Auth
export const authAPI = {
    register: (body) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    getProfile: () => apiCall('/auth/profile'),
    forgotPassword: (email) => apiCall('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (token, newPassword) => apiCall('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
};

// Members
export const membersAPI = {
    getAll: () => apiCall('/members'),
    getOne: (id) => apiCall(`/members/${id}`),
    create: (body) => apiCall('/members', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => apiCall(`/members/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => apiCall(`/members/${id}`, { method: 'DELETE' }),
};

// Families
export const familiesAPI = {
    getAll: () => apiCall('/families'),
    getOne: (id) => apiCall(`/families/${id}`),
    create: (body) => apiCall('/families', { method: 'POST', body: JSON.stringify(body) }),
    addMember: (familyId, body) => apiCall(`/families/${familyId}/members`, { method: 'POST', body: JSON.stringify(body) }),
    delete: (id) => apiCall(`/families/${id}`, { method: 'DELETE' }),
    submitDeletion: (body) => apiCall('/families/deletion-request', { method: 'POST', body: JSON.stringify(body) }),
    getDeletionRequests: () => apiCall('/families/deletion-requests/all'),
    reviewDeletion: (id, body) => apiCall(`/families/deletion-request/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    updateMemberRole: (familyId, memberId, body) => apiCall(`/families/${familyId}/members/${memberId}`, { method: 'PATCH', body: JSON.stringify(body) }),
    removeMember: (familyId, memberId) => apiCall(`/families/${familyId}/members/${memberId}`, { method: 'DELETE' }),
};

// Events
export const eventsAPI = {
    getAll: () => apiCall('/events'),
    create: (body) => apiCall('/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => apiCall(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => apiCall(`/events/${id}`, { method: 'DELETE' }),
};

// Announcements
export const announcementsAPI = {
    getAll: () => apiCall('/announcements'),
    create: (body) => apiCall('/announcements', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => apiCall(`/announcements/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => apiCall(`/announcements/${id}`, { method: 'DELETE' }),
};

// Photos
export const photosAPI = {
    getAll: () => apiCall('/photos'),
    create: (formData) => apiCall('/photos', { method: 'POST', body: formData }),
    delete: (id) => apiCall(`/photos/${id}`, { method: 'DELETE' }),
};

// Prayer Requests
export const prayerAPI = {
    submit: (body) => apiCall('/prayer-requests', { method: 'POST', body: JSON.stringify(body) }),
    getAll: () => apiCall('/prayer-requests'),
    getMine: () => apiCall('/prayer-requests/mine'),
    update: (id, body) => apiCall(`/prayer-requests/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// Appointments
export const appointmentsAPI = {
    book: (body) => apiCall('/appointments', { method: 'POST', body: JSON.stringify(body) }),
    getAll: () => apiCall('/appointments'),
    getMine: () => apiCall('/appointments/mine'),
    update: (id, body) => apiCall(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// Baptism
export const baptismAPI = {
    register: (body) => apiCall('/baptism', { method: 'POST', body: JSON.stringify(body) }),
    getAll: () => apiCall('/baptism'),
    update: (id, body) => apiCall(`/baptism/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// Marriage
export const marriageAPI = {
    register: (body) => apiCall('/marriage', { method: 'POST', body: JSON.stringify(body) }),
    getAll: () => apiCall('/marriage'),
    update: (id, body) => apiCall(`/marriage/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};

// Ministries
export const ministryAPI = {
    join: (body) => apiCall('/ministries/join', { method: 'POST', body: JSON.stringify(body) }),
    sendContact: (body) => apiCall('/ministries/form', { method: 'POST', body: JSON.stringify(body) }),
};

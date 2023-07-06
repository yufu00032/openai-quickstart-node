import api from 'axios';

export default {
  getRobot: async () => await api.get('/api/robot'),
  getRealTime: async () => await api.get('/api/realtime'),
  sendRobot: async (data) => await api.post('/api/robot', data),
  sendRealTime: async (data) => await api.post('/api/realtime', data),
  getFaq: async () => await api.get('http://[::1]:4020/faq-categories/tw'),
};

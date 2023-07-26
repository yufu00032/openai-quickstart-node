import api from 'axios';

export default {
  sendFaq: async (data) => await api.post('/api/faq', data),
  sendHotelRecommend: async (data) => await api.post('/api/hotel-recommend', data),
  sendUserRecommend: async (data) => await api.post('/api/user-recommend', data),
};

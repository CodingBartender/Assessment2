import axiosInstance from '../axiosConfig';

export const adminAPI = {
  // Users
  listUsers: () => axiosInstance.get('/api/admin/users'),
  createUser: (data) => axiosInstance.post('/api/admin/users', data),
  deleteUser: (id) => axiosInstance.delete(`/api/admin/users/${id}`),

  // Stocks
  listStocks: () => axiosInstance.get('/api/admin/stocks'),
  createStock: (data) => axiosInstance.post('/api/admin/stocks', data),
  deleteStock: (id) => axiosInstance.delete(`/api/admin/stocks/${id}`),

}

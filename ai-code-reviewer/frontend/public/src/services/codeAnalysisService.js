import api from './authService';

export const codeAnalysisService = {
  analyzeCode: (code, language) => {
    return api.post('/analyze/', { code, language });
  },
  
  getAnalysisHistory: (skip = 0, limit = 100) => {
    return api.get(`/history/?skip=${skip}&limit=${limit}`);
  }
};
import API from '../api';

export const getFeedbackSurvey = id => API.get(`v1/enrollments/${id}/feedback`);

export const postSurveyAnswer = (id, itemId, content) => API.post(`v1/enrollments/${id}/feedback`, { 'item_id': itemId, content });

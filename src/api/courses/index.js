import API from '../api';

//export const get = query => API.get(`v1/products${query ? `?query=${query}` : '?type[]=1,3,7&limit=10000'}`);
export const get = query => API.get(`v1/products${query ? `?${query}` : ''}`);

export const getMoreQuantity = (quantity, filter) => API.get(`v1/products?limit=9&offset=${quantity}&${filter}`);

export const getWithFilter = filter => API.get(`v1/products?${filter}`);

export const getFromQuery = query => API.get(`v1/search?title=${query}&limit=10000`);

export const getOneFromProducts = id => API.get(`v1/products/${id}`);

export const getOneFromItemProducts = id => API.get(`v1/products/${id}/items`);

export const getOneFromCourses = id => API.get(`v1/courses/${id}`);

export const getRelated = id => API.get(`v1/products/${id}/related`);

export const getPurchased = id => API.get(`v1/students/${id}`);

export const getByCategory = id => API.get(`v1/products?category=${id}`);

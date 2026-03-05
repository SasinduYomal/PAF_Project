import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8080/api/topics',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export const getTopics = () =>
    client.get('').then(res => res.data);

export const createTopic = (topic) =>
    client.post('', topic).then(res => res.data);

export const updateTopic = (id, topic) =>
    client.put(`/${id}`, topic).then(res => res.data);

export const deleteTopic = (id) =>
    client.delete(`/${id}`);
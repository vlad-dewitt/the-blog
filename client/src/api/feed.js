import { getFromStorage } from '../utils/local_storage';



export const getFeedLength = function() {
  return new Promise(async (resolve, reject) => {
    const auth = await getFromStorage('auth');

    if (!auth || !auth.userId || !auth.token) {
      return resolve(null);
    }

    const response = await fetch('/api/feed/feed-length', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': auth.token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    resolve(data.count);
  })
}

export const getPosts = function(index) {
  return new Promise(async (resolve, reject) => {
    const auth = await getFromStorage('auth');

    if (!auth || !auth.userId || !auth.token) {
      return resolve(null);
    }

    const url = index ? `/api/feed?index=${ index }` : '/api/feed'

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': auth.token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    resolve(data.feed);
  })
}

export const createPost = function(text) {
  return new Promise(async (resolve, reject) => {
    const auth = await getFromStorage('auth');

    if (!auth || !auth.userId || !auth.token) {
      return resolve(null);
    }

    const response = await fetch('/api/feed/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': auth.token
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    resolve(data);
  })
}

export const getPost = function(id) {
  return new Promise(async (resolve, reject) => {
    const auth = await getFromStorage('auth');

    if (!auth || !auth.userId || !auth.token) {
      return resolve(null);
    }

    const response = await fetch(`/api/feed/${ id }`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': auth.token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    resolve(data);
  })
}

export const commentPost = function(post_id, text) {
  return new Promise(async (resolve, reject) => {
    const auth = await getFromStorage('auth');

    if (!auth || !auth.userId || !auth.token) {
      return resolve(null);
    }

    const response = await fetch('/api/feed/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': auth.token
      },
      body: JSON.stringify({ post_id, text })
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    resolve(data);
  })
}

import { getFromStorage, setInStorage, removeFromStorage } from '../utils/local_storage';



export const verify = function() {
  return new Promise(async (resolve, reject) => {
    const auth = await getFromStorage('auth');

    if (!auth || !auth.userId || !auth.token) {
      return resolve(null);
    }

    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ userId: auth.userId, token: auth.token })
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    const { userId, token } = data;

    await setInStorage('auth', { userId, token });

    resolve(data);
  })
}

export const login = function(username, password) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    const { userId, token } = data;

    await setInStorage('auth', { userId, token });

    resolve(data);
  })
}

export const signUp = function(username, password) {
  return new Promise(async (resolve, reject) => {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    login(username, password).then(res => {
      resolve(res);
    }).catch(err => {
      reject(data.message || 'Something went wrong...')
    })
  })
}

export const updateProfile = function(profile) {
  return new Promise(async (resolve, reject) => {
    const auth = await getFromStorage('auth');

    if (!auth || !auth.userId || !auth.token) {
      return resolve(null);
    }

    const response = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': auth.token
      },
      body: JSON.stringify({ userId: auth.userId, token: auth.token, profile })
    });

    const data = await response.json();

    if (!response.ok) {
      reject(data.message || 'Something went wrong...')
    }

    resolve(data);
  })
}

export const logout = function() {
  return new Promise(async (resolve, reject) => {
    await removeFromStorage('auth');
    resolve('success');
  })
}

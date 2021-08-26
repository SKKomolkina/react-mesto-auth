export const BASE_URL = 'https://auth.nomoreparties.co';


export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })
}


export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })
    .then((response => response.json()))
    .then((data) => {
        console.log(data)
        if(data.jwt){
            console.log(data.jwt);
            localStorage.setItem('jwt', data.jwt);
            return data;
        }
    })
    .catch(err => console.log(err))
}


export const getContent = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((response => response.json()))
    .then(data => data)
}
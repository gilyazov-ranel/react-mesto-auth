export const BASE_URL = 'https://auth.nomoreparties.co';

export function register(form) {

    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
    })
        .then((response) => {
            try {
                if (response.status === 201 || response.status === 200) {
                    return response.json();
                }
            } catch (err) {
                return err;
            }
        })
        .then((res) => {
            return res;
        })
        .catch((err) => console.log(err));
};

export function authorize(form) {

    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
    })
        .then((response => response.json()))
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                return data;
            }
        })
        .catch(err => console.log(err))
};

export function checkToken(token) {

    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then((response => response.json()))
        .then(data => data)
}; 
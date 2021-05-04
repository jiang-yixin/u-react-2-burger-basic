import axios from 'axios';

import {
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_FAIL,
    AUTH_LOGOUT,
    SET_AUTH_REDIRECT_PATH,
} from './actionTypes';

export const authStart = () => {
    return {
        type: AUTH_START,
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: AUTH_SUCCESS,
        token,
        userId,
    }
}

export const authFail = (error) => {
    return {
        type: AUTH_FAIL,
        error
    }
}

export const authLogout = () => {
    return {
        type: AUTH_LOGOUT
    }
}

export const logout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime * 1000);
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email,
            password,
            returnSecureToken: true,
        };

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAdIkOsjcjlKRYe4u0liBwtmc_vjAQ_5FM';
        if (!isSignup) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAdIkOsjcjlKRYe4u0liBwtmc_vjAQ_5FM';
        }

        axios.post(url, authData)
            .then(response => {
                console.log(response);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(logout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            });
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: SET_AUTH_REDIRECT_PATH,
        path,
    }
}

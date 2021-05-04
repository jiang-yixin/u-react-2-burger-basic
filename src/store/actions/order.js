import {
    PURCHASE_BURGER_SUCCESS,
    PURCHASE_BURGER_FAIL,
    PURCHASE_BURGER_START,
    PURCHASE_INIT,
    FETCH_ORDERS_START,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAIL,
} from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = () => {
    return {
        type: PURCHASE_BURGER_SUCCESS
    }
}

export const purchaseBurgerFail = (err) => {
    return {
        type: PURCHASE_BURGER_FAIL,
        error: err,
    }
}

export const purchaseBurgerStart = () => {
    return {
        type: PURCHASE_BURGER_START,
    };
}

export const purchaseInit = () => {
    return {
        type: PURCHASE_INIT,
    }
}

export const purchaseBurger = (token, orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json?auth=' + token, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess());
            })
            .catch(err => {
                dispatch(purchaseBurgerFail(err));
            });
    }
}

export const fetchOrdersStart = () => {
    return {
        type: FETCH_ORDERS_START
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type: FETCH_ORDERS_SUCCESS,
        orders: orders,
    }
}

export const fetchOrdersFail = (error) => {
    return {
        type: FETCH_ORDERS_FAIL,
        error: error,
    }
}

export const fetchOrders = (token) => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        axios.get('/orders.json?auth=' + token)
            .then(({ data }) => {
                const fetchedOrders = [];
                for (let key in data) {
                    fetchedOrders.push({
                        ...data[key],
                        id: key,
                    });
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(err => {
                dispatch(fetchOrdersFail(err));
            });
    }
}

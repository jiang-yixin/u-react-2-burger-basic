import * as actionTypes from './actions';

const initalState = {
    ingredients: {
        meat: 0,
        salad: 0,
        cheese: 0,
        bacon: 0,
    },
    totalPrice: 4,
}

const INGREDIENT_PRICES = {
    meat: 1.1,
    salad: 0.5,
    cheese: 0.9,
    bacon: 1.5,
};

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
            }
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
            }
        default:
            return state;
    }
}

export default reducer;

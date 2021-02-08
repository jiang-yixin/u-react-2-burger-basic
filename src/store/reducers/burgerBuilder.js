import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initalState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
}

const INGREDIENT_PRICES = {
    meat: 1.1,
    salad: 0.5,
    cheese: 0.9,
    bacon: 1.5,
};

const addIngredient = (state, action) => {
    return updateObject(state, {
        ingredients: updateObject(state.ingredients, {
            [action.ingredientName]: state.ingredients[action.ingredientName] + 1
        }),
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    })
}

const removeIngredient = (state, action) => {
    return updateObject(state, {
        ingredients: updateObject(state.ingredients, { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }),
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
    })
}

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: {
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat,
            salad: action.ingredients.salad,
        },
        totalPrice: 4,
        error: false,
    })
}

const fetchIngredientsFailed = (state, action) => {
    return updateObject(state, { error: true });
}

const reducer = (state = initalState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
        default: return state;
    }
}

export default reducer;

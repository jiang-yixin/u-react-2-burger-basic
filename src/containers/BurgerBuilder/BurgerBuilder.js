import React, { Component } from 'react'

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    meat: 1.1,
    salad: 0.5,
    cheese: 0.9,
    bacon: 1.5,
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false,
    };

    componentDidMount() {
        axios.get('https://react-my-burger-b17c6-default-rtdb.firebaseio.com/ingredients.json')
            .then(response => {
                const ingredients = response.data;
                this.setState({ ingredients });
                this.updatePurchaseableState(ingredients);
            })
            .catch(err => {
                this.setState({ error: true });
            });
    }

    updatePurchaseableState = (ingredients) => {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
            .reduce((sum, el) => sum + el, 0);

        this.setState({ purchaseable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const newIngredients = {
            ...this.state.ingredients,
        };
        newIngredients[type] = this.state.ingredients[type] + 1;
        const newTotalPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({
            ingredients: newIngredients,
            totalPrice: newTotalPrice,
        })
        this.updatePurchaseableState(newIngredients);
    };

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] <= 0) {
            return;
        }

        const newIngredients = {
            ...this.state.ingredients,
        };
        newIngredients[type] = this.state.ingredients[type] - 1;
        const newTotalPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({
            ingredients: newIngredients,
            totalPrice: newTotalPrice,
        })
        this.updatePurchaseableState(newIngredients);
    };

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false, loading: false });
    }

    purchaseContinueHandler = () => {
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Simon',
                address: 'Paris',
            }
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false });
            })
            .catch(err => {
                this.setState({ loading: false, purchasing: false });
            });
    }

    render() {
        let burger = this.state.error ?
            <p style={{ textAlign: 'center' }}>It is failed to load ingredients</p> : <Spinner />;
        let orderSummary = null;

        if (this.state.ingredients) {
            const disabledInfo = { ...this.state.ingredients };
            for (const key in disabledInfo) {
                disabledInfo[key] = disabledInfo[key] <= 0;
            }

            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        added={this.addIngredientHandler}
                        removed={this.removeIngredientHandler}
                        disabledInfo={disabledInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler} />
                </Aux>
            );

            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                price={this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
            if (this.state.loading) {
                orderSummary = <Spinner />;
            }
        }

        return (
            <Aux>
                <Modal
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
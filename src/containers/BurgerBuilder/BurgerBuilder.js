import React, { Component } from 'react'
import { connect } from 'react-redux';
 
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false,
    };

    componentDidMount() {
        // axios.get('https://react-my-burger-b17c6-default-rtdb.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         const ingredients = response.data;
        //         this.setState({ ingredients });
        //         this.updatePurchaseableState(ingredients);
        //     })
        //     .catch(err => {
        //         this.setState({ error: true });
        //     });
    }

    updatePurchaseable = (ingredients) => {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
            .reduce((sum, el) => sum + el, 0);
        
        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false, loading: false });
    }

    purchaseContinueHandler = () => {
        const queryParams = Object.keys(this.props.ings).map(igKey => {
            return encodeURIComponent(igKey) + '=' + encodeURIComponent(this.props.ings[igKey]);
        });
        queryParams.push('price=' + this.props.price);

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryParams.join('&'),
        });
    }

    render() {
        let burger = this.state.error ?
            <p style={{ textAlign: 'center' }}>It is failed to load ingredients</p> : <Spinner />;
        let orderSummary = null;

        if (this.props.ings) {
            const disabledInfo = { ...this.props.ings };
            for (const key in disabledInfo) {
                disabledInfo[key] = disabledInfo[key] <= 0;
            }

            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        added={this.props.onIngredientAdded}
                        removed={this.props.onIngredientRemoved}
                        disabledInfo={disabledInfo}
                        price={this.props.price}
                        purchaseable={this.updatePurchaseable(this.props.ings)}
                        ordered={this.purchaseHandler} />
                </Aux>
            );

            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

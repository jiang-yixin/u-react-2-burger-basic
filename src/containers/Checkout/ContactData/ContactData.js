import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { purchaseBurger } from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2,
                },
                validationError: 'Wrong name',
                valid: false,
                touched: false,
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street',
                },
                value: '',
                validation: {
                    required: true
                },
                validationError: 'Wrong street',
                valid: false,
                touched: false,
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                },
                validationError: 'Wrong zip code',
                valid: false,
                touched: false,
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Country',
                },
                value: '',
                validation: {
                    required: true
                },
                validationError: 'Wrong country',
                valid: false,
                touched: false,
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your E-Mail',
                },
                value: '',
                validation: {
                    required: true
                },
                validationError: 'Wrong e-mail',
                valid: false,
                touched: false,
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'fastest' },
                        { value: 'cheapest', displayValue: 'cheapest' },
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true,
            }
        },
        formIsValid: false,
    }

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formInputId in this.state.orderForm) {
            formData[formInputId] = this.state.orderForm[formInputId].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
        }

        this.props.onOrderBurger(this.props.token, order);
    }

    checkValidity(value, rules) {
        let isValid = true;
        if (!rules) {
            return true;
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangedHandler = (event, inputId) => {
        const updatedForm = { ...this.state.orderForm };
        updatedForm[inputId].value = event.target.value;
        updatedForm[inputId].touched = true;
        updatedForm[inputId].valid = this.checkValidity(event.target.value, updatedForm[inputId].validation);

        let formIsValid = true;
        for (let inputId in updatedForm) {
            formIsValid = formIsValid && updatedForm[inputId].valid;
        }

        this.setState({
            orderForm: updatedForm,
            formIsValid,
        });
    }

    render() {
        let form = <Spinner />;
        if (!this.props.loading) {
            const inputElementsArray = [];
            for (let key in this.state.orderForm) {
                inputElementsArray.push({
                    id: key,
                    config: this.state.orderForm[key],
                });
            }

            form = (
                <form onSubmit={this.orderHandler}>
                    {inputElementsArray.map(inputElement => (
                        <Input
                            key={inputElement.id}
                            elementType={inputElement.config.elementType}
                            elementConfig={inputElement.config.elementConfig}
                            value={inputElement.config.value}
                            invalid={!inputElement.config.valid}
                            shouldValidate={inputElement.config.validation}
                            touched={inputElement.config.touched}
                            validationError={inputElement.config.validationError}
                            changed={(event) => this.inputChangedHandler(event, inputElement.id)} />
                    ))}
                    <Button
                        btnType="Success"
                        disabled={!this.state.formIsValid}>
                        ORDER
                    </Button>
                </form>
            );
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (token, order) => dispatch(purchaseBurger(token, order))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));

import React, { Component } from 'react';

import classes from './ContactData.css';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

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
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();

        this.setState({ loading: true });

        const formData = {};
        for (let formInputId in this.state.orderForm) {
            formData[formInputId] = this.state.orderForm[formInputId].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData,
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            })
            .catch(err => {
                this.setState({ loading: false });
            });
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = isValid && value.trim() !== '';
        }

        if (rules.minLength) {
            isValid = isValid && value.trim().length >= rules.minLength;
        }

        if (rules.maxLength) {
            isValid = isValid && value.trim().length <= rules.maxLength;
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
        if (!this.state.loading) {
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

export default ContactData;

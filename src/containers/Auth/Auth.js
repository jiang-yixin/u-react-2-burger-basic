import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import {
    auth,
    setAuthRedirectPath,
} from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your e-mail',
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                validationError: 'Wrong e-mail',
                valid: false,
                touched: false,
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                },
                validationError: 'Wrong e-mail',
                valid: false,
                touched: false,
            },
        },
        isSignup: true,
    };

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
        const updateControls = {
            ...this.state.controls,
            [inputId]: {
                ...this.state.controls[inputId],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[inputId].validation),
                touched: true
            }
        }

        this.setState({
            controls: updateControls,
        })
    }

    authHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(
            this.state.controls.email.value,
            this.state.controls.password.value,
            this.state.isSignup
        );
    }

    switchAuthTypeHandler = () => {
        this.setState(preState => {
            return { isSignup: !preState.isSignup };
        });
    }

    componentDidMount() {
        if (!this.props.buildingBurger) {
            this.props.onSetAuthRedirectPath('/');
        }
    }

    render() {
        const inputElementsArray = [];
        for (let key in this.state.controls) {
            inputElementsArray.push({
                id: key,
                config: this.state.controls[key],
            });
        }

        let form = (
            inputElementsArray.map(inputElement => (
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
            ))
        );

        if (this.props.loading) {
            form = <Spinner />;
        }

        const errorMessage = this.props.error ? (<p>{this.props.error.message}</p>) : null;

        const authRedirect = this.props.isAuthenticated ? <Redirect to={this.props.authRedirectPath} /> : null;

        return (
            <div className={classes.Auth}>
                <form onSubmit={this.authHandler}>
                    {authRedirect}
                    {errorMessage}
                    {form}
                    <Button btnType="Success">{this.state.isSignup ? 'Sign up' : 'Sign in'}</Button>
                </form>
                <Button
                    clicked={this.switchAuthTypeHandler}
                    btnType="Danger">
                    Switch to {this.state.isSignup ? 'sign in' : 'sign up'}
                </Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(auth(email, password, isSignup)),
        onSetAuthRedirectPath: (path) => dispatch(setAuthRedirectPath(path)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
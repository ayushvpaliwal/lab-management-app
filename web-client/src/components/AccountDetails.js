import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import Sidebar from './Sidebar';

const required = value => (value ? undefined : 'Required')
const minLength = value => (value.length >= 8 ? undefined : 'Password must be at least 8 characters')
const containsNumber = value => (/\d/.test(value) ? undefined : 'Password must contain at least one number')
const matchesOldPassword = oldPassword => value => ( value == oldPassword ? undefined : 'Does not match old password' )
const newPasswordsMatch = newPassword => value => ( value == newPassword ? undefined : 'Passwords do not match' )
const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

class AccountDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editPassword: false
        }
    }

    editPassword = () => {
        this.setState({
            editPassword: true
        });
    }

    handleSubmit = async values => {
        this.props.putUser({
            _id: JSON.parse(localStorage.getItem('userData'))._id,
            "password": values.confirmPassword
        }, true);
        
        alert("Password Successfully Changed!")
    }

    render() {
        return (
            <div id="page-wrap" className="container-fluid">         
                <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} logoutUser={this.props.logoutUser} />                               
                <div className="row flex-fill h-100 d-flex">
                    <div className="col">
                        <div style={{"z-index":"10", "position":"fixed", "border-bottom":"1px solid #E2E2E4", "background-color": "white", "margin-top": "0px", "padding": "10px", "width":"110%"}} className="row header">
                            <div className="col my-auto ml-5">
                                <span className="menu-header"> Account Details </span>
                            </div>
                        </div>
                        <div style={{"border-right":"1px solid #E2E2E4", "paddingTop":"81px", "paddingLeft":"18px"}} className="row">
                            <div className="col-12">
                                <div className="row">    
                                    <div>
                                        <a className="account-icon" href="/account"><span className="dot" style={{"height": "50px",
                                                                    "width": "50px",
                                                                    "border": "0.5px solid rgba(229, 229, 229, 1)",
                                                                    "background-color": "#ffffff",
                                                                    "border-radius": "50%",
                                                                    "display": "inline-block",
                                                                    "box-shadow": "0px 0px 1px 0px #888888",
                                                                    "padding":"12px",
                                                                    "margin-right":"10px",
                                                                    "color":"#432F87",
                                                                    "font-weight":"600"
                                                                    }}>
                                                {JSON.parse(localStorage.getItem('userData')).firstName.substring(0,1)
                                                                + JSON.parse(localStorage.getItem('userData')).lastName.substring(0,1)}
                                        </span></a>
                                    </div>
                                    <div>
                                        <a style={{"color":"black"}} href="/account"><span style={{"display":"block", "fontWeight":"600", "color":"#432F87"}}>{this.props.auth.user.firstName + ' ' + this.props.auth.user.lastName}</span></a>
                                        <span>{this.props.auth.user.supervisor ? 'Supervisor Account' : 'Regular Account'}   </span>        
                                    </div>
                                </div>
                                <div style={{"marginTop":"20px"}} className="row">
                                    <div style={{"fontWeight":"600", "fontSize":"18px", "color":"#432F87", "padding":"0px"}} className="col-2 col-lg-1">
                                        Username
                                    </div>
                                    <div style={{"fontSize":"20px"}} className="col">
                                        {this.props.auth.user.username}
                                    </div>
                                </div>
                                <div style={{"marginTop":"10px"}} className="row">
                                    <div style={{"fontWeight":"600", "fontSize":"18px", "color":"#432F87", "padding":"0px"}} className="col-2 col-lg-1">
                                        Password
                                    </div>
                                    <div style={{"fontSize":"18px"}} className="col-3 col-md-2 col-xl-1">
                                        **********
                                    </div>
                                    <div style={{"fontSize":"18px"}} className="col-1 text-center">
                                            <button style={{"backgroundColor":"#432F87", "border":"none", "borderRadius":"5px", "boxShadow":"0px 0px 3px 0px grey", "color":"white", "padding":"2px 10px 2px 10px"}} onClick={this.editPassword}>
                                                Edit
                                            </button>
                                    </div>
                                </div>
                                {!this.state.editPassword ? <div></div> : (
                                <Form
                                    onSubmit={this.handleSubmit}
                                    render={({ handleSubmit, form, submitting, pristine, values }) => (
                                        <form onSubmit={handleSubmit}>
                                        {/* <Field
                                            name="oldPassword"
                                            validate={composeValidators(required, matchesOldPassword(this.state.oldPassword))}
                                        >
                                            {({ input, meta }) => (
                                            <div style={{"marginTop":"10px"}} className="row">
                                                <div style={{"fontWeight":"600", "fontSize":"18px", "color":"#432F87", "paddingRight":"15px"}} className="col-1">
                                                    Old Password
                                                </div>
                                                <div className="col-11">
                                                    <input style={{"width":"230px", "border":"none", "borderRadius":"5px", "height":"30px", "boxShadow":"0px 0px 3px 0px lightgrey"}} {...input} type="password" placeholder="Old Password" />
                                                    {meta.error && meta.touched && <span style={{"marginLeft":"10px", "color":"red"}}>{meta.error}</span>}
                                                </div>
                                            </div>
                                            )}
                                        </Field> */}
                                        <Field
                                            name="newPassword"
                                            validate={composeValidators(required, containsNumber, minLength)}
                                        >
                                            {({ input, meta }) => (
                                            <div style={{"marginTop":"10px"}} className="row">
                                                <div style={{"fontWeight":"600", "fontSize":"18px", "color":"#432F87", "padding":"0px"}} className="col-2 col-lg-1">
                                                    New Password
                                                </div>
                                                <div className="col">
                                                    <input style={{"width":"230px", "border":"none", "borderRadius":"5px", "height":"30px", "boxShadow":"0px 0px 3px 0px lightgrey"}} {...input} type="password" placeholder="New Password" />
                                                    {meta.error && meta.submitFailed && <span style={{"marginLeft":"10px", "color":"red"}} className="error">{meta.error}</span>}
                                                </div>
                                            </div>
                                            )}
                                        </Field>
                                        <Field
                                            name="confirmPassword"
                                            validate={composeValidators(required, newPasswordsMatch(values.newPassword))}
                                        >
                                            {({ input, meta }) => (
                                            <div style={{"marginTop":"10px"}} className="row">
                                                <div style={{"fontWeight":"600", "fontSize":"18px", "color":"#432F87", "padding":"0px"}} className="col-2 col-lg-1">
                                                    Confirm
                                                </div>
                                                <div className="col">
                                                    <input style={{"width":"230px", "border":"none", "borderRadius":"5px", "height":"30px", "boxShadow":"0px 0px 3px 0px lightgrey"}} {...input} type="password" placeholder="Confirm New Password" />
                                                    {meta.error && meta.submitFailed && <span style={{"marginLeft":"10px", "color":"red"}} className="error">{meta.error}</span>}
                                                </div>
                                            </div>
                                            )}
                                        </Field>
                                        <div className="mt-3 row">
                                            <div style={{"fontSize":"18px"}} className="col offset-2 offset-lg-1">
                                                <button style={{"backgroundColor":"#432F87", "border":"none", "borderRadius":"5px", "boxShadow":"0px 0px 3px 0px grey", "color":"white", "padding":"2px 10px 2px 10px"}} type="submit" disabled={submitting}>
                                                    Save Password
                                                </button>
                                            </div>
                                        </div>
                                        </form>
                                    )}
                                />
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default AccountDetails
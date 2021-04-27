import React, { Component } from 'react';
import { Modal, Button}  from "react-bootstrap";
import { Form, Field } from 'react-final-form';

const required = value => (value ? undefined : 'Required')
const minLength = value => (value.length >= 8 ? undefined : 'Password must be at least 8 characters')
const containsNumber = value => (/\d/.test(value) ? undefined : 'Password must contain at least one number')
const matchesOldPassword = oldPassword => value => ( value == oldPassword ? undefined : 'Does not match old password' )
const newPasswordsMatch = newPassword => value => ( value == newPassword ? undefined : 'Passwords do not match' )
const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)


class ResetPassword extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (values) => {
        this.props.putUser({
            _id: this.props.selectedUser._id,
            password: values.confirmPassword
        }, true);

        this.props.handleModalClose();

        alert("Password Successfully Changed!")
    }


    render() {
        return(
            <Modal show={this.props.isModalOpen} onHide={this.props.handleModalClose}>
                <Modal.Header closeButton>
                    <h4>Reset Password for {this.props.selectedUser ? this.props.selectedUser.username : ''}</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-12">
                        <Form
                            onSubmit={this.handleSubmit}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <div className="container-fluid">
                                    <div className="row ml-2 mt-2">
                                        <div className="container-fluid">
                                            <form id="addUserForm" onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <Field
                                                    name="newPassword"
                                                    component="input"
                                                    type="password"
                                                    validate={composeValidators(required, minLength, containsNumber)}
                                                    >
                                                    {({ input, meta }) => (
                                                        <div className="col-12">
                                                            <label>New Password</label>
                                                            <input {...input} placeholder="New Password"/>
                                                            {meta.error && meta.submitFailed && <span>{meta.error}</span>}
                                                        </div>
                                                    )}
                                                    </Field>
                                                </div>
                                                <div className="row">
                                                    <Field
                                                    name="confirmPassword"
                                                    component="input"
                                                    type="password"
                                                    validate={composeValidators(required, newPasswordsMatch(values.newPassword))}
                                                    >
                                                    {({ input, meta }) => (
                                                        <div className="col-12">
                                                            <label>Confirm Password</label>
                                                            <input {...input} placeholder="Confirm Password"/>
                                                            {meta.error && meta.submitFailed && <span>{meta.error}</span>}
                                                        </div>
                                                    )}
                                                    </Field>
                                                </div>                   
                                                <div className="row">
                                                    <div className="col-12">
                                                        <button className="cancel-button" type="button"
                                                            onClick={() => {
                                                                this.props.handleModalClose();
                                                                var fields = form.getRegisteredFields()
                                                                fields.map(field => form.resetFieldState(field))}}>
                                                            Cancel
                                                        </button>
                                                        <button className="submit-button" type="submit" disabled={submitting || pristine}>
                                                            Change Password
                                                        </button>
                                                    </div>                                                    
                                                </div>
                                            </form>
                                        </div>                                               
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

}

export default ResetPassword;
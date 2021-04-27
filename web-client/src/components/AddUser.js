import React, { Component } from 'react';
import { Modal, Button}  from "react-bootstrap";
import { Form, Field } from 'react-final-form';

const emailRe = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))/;
const required = value => (value ? undefined : 'Required')
const usernameCheck = userRole => value => {
    if (userRole == "admin")
        return undefined
    else {
        var split = value.split('@')
        return emailRe.test(split[0]) && split[1] == "gosh.nhs.uk" ? undefined : 'Username must be a @gosh.nhs.uk email'
    }
}
const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)


class AddUser extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (values) => {
        var user = {
            username: values.username,
            password: values.password,
            supervisor: values.role=="supervisor" ? true : false,
            admin: values.role=="admin" ? true : false,
            firstName: values.firstName,
            lastName: values.lastName
        }

        this.props.postUser(user);

        this.props.handleModalClose();

    }


    render() {
        return(
            <Modal show={this.props.isModalOpen} onHide={this.props.handleModalClose}>
                <Modal.Header closeButton>
                    <h4>Add New User</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-12">
                        <Form
                            onSubmit={this.handleSubmit}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <div className="container-fluid">
                                    <div className="row ml-2 mt-2">
                                        <form id="addUserForm" onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-6">
                                                    <label>User Role</label>
                                                    <Field
                                                    name="role"
                                                    component="select"
                                                    defaultValue="regular"
                                                    >
                                                        <option selected value="regular">Regular User</option>
                                                        <option value="supervisor">Supervisor User</option>
                                                        <option value="admin">Admin</option>
                                                    </Field>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <Field
                                                name="username"
                                                component="input"
                                                type="text"
                                                validate={composeValidators(required, usernameCheck(values.role))}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-12">
                                                        <label>Username</label>
                                                        <input {...input} placeholder="Username"/>
                                                        {meta.error && meta.submitFailed && <span>{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                            </div>
                                            <div className="row">
                                                <Field
                                                name="password"
                                                component="input"
                                                type="password"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-12">
                                                        <label>Password</label>
                                                        <input {...input} placeholder="Password"/>
                                                        {meta.error && meta.submitFailed && <span>{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                            </div>
                                            <div className="row">
                                                <Field
                                                name="firstName"
                                                component="input"
                                                type="text"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-6">
                                                        <label>First Name</label>
                                                        <input {...input} placeholder="First Name"/>
                                                        {meta.error && meta.submitFailed && <span>{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                                <Field
                                                name="lastName"
                                                component="input"
                                                type="text"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-6">
                                                        <label>Last Name</label>
                                                        <input {...input} placeholder="Last Name"/>
                                                        {meta.error && meta.submitFailed && <span>{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                            </div>                               
                                            <div className="row">
                                                <div className="col-12">
                                                    <button class="cancel-button" type="button"
                                                        onClick={() => {
                                                            this.props.handleModalClose();
                                                            var fields = form.getRegisteredFields()
                                                            fields.map(field => form.resetFieldState(field))}}>
                                                        Cancel
                                                    </button>
                                                    <button class="submit-button" type="submit" disabled={submitting || pristine}>
                                                        Add User
                                                    </button>
                                                </div>                                                    
                                            </div>
                                        </form>
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

export default AddUser;
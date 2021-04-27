import { isThursday } from 'date-fns';
import React, { Component } from 'react';
import { Modal, Button}  from "react-bootstrap";
import { Form, Field } from 'react-final-form';

const required = value => (value ? undefined : 'Required')

class EditReagent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reagentName: '',
            supplier: '',
            lotNr: '',
            catNr: '',
            expiryDate: null,
            dateReceived: null,
            storageLocation: '',
            status: '',
            condition: '',
            comment: '',
            action: '',
            assayName: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ reagentName: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.reagentName : ''});
        this.setState({ supplier: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.supplier : ''});
        this.setState({ lotNr: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.lotNr : ''});
        this.setState({ catNr: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.catNr : ''});
        this.setState({ expiryDate: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.expiryDate.substring(0, 10) : null});
        this.setState({ dateReceived: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.dateReceived.substring(0, 10) : null});
        this.setState({ status: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.status : ''});
        this.setState({ condition: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.condition : ''});
        this.setState({ comment: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.comment : ''});
        this.setState({ action: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.action : ''});
        this.setState({ unit: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.unit : ''});
        this.setState({ assayName: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.assayName : ''});
    }      

    handleSubmit = (values) => {
        var expiryDate = new Date(values.expiryDate);
        expiryDate = expiryDate.toISOString();

        var dateReceived = new Date(values.dateReceived);
        dateReceived = dateReceived.toISOString();

        var updatedReagent = {
            _id: this.props.selectedRow.selectedFlatRows._id,
            reagentName: values.reagentName,
            lotNr: values.lotNr,
            catNr: values.catNr,
            expiryDate: expiryDate,
            dateReceived: dateReceived,
            storageLocation: values.storageLocation,
            status: values.status,
            condition: values.condition,
            comment: values.comment,
            action: values.action,
            supplier: values.supplier
        }

        if ((values.status != this.state.status) && (values.status=="DISPOSED")) {
            var action = "dispose"    
        }
        else {
            var action = "editDetails"
        }

        this.props.putReagent(updatedReagent, action);

        this.props.handleModalClose();

    }


    render() {
        return(
            <Modal show={this.props.isModalOpen} onHide={this.props.handleModalClose}>
                <Modal.Header closeButton>
                    <h4>Edit Reagent</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <Form
                            onSubmit={this.handleSubmit}
                            initialValues={{ 
                                reagentName: this.state.reagentName,
                                supplier: this.state.supplier,
                                lotNr: this.state.lotNr,
                                catNr: this.state.catNr,
                                expiryDate: this.state.expiryDate,
                                dateReceived: this.state.dateReceived,
                                storageLocation: this.state.storageLocation,
                                status: this.state.status,
                                condition: this.state.condition,
                                comment: this.state.comment,
                                action: this.state.action
                            }}
                            render={({ handleSubmit, form, submitting, pristine, values }) => (
                                <div className="row ml-2 mt-2">
                                    <div className="col-12">
                                        <form id="editReagentForm" onSubmit={handleSubmit}>
                                            <div className="row">
                                                <Field
                                                name="reagentName"
                                                component="input"
                                                type="text"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <>
                                                    <div className="col-6">
                                                        <label>Reagent Name</label>
                                                        <input {...input} placeholder="Reagent Name"/>
                                                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                                                    </div>
                                                    </>
                                                )}
                                                </Field>
                                                <Field
                                                name="supplier"
                                                component="input"
                                                type="text"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-6">
                                                        <label>Supplier</label>
                                                        <input {...input} placeholder="Supplier"/>
                                                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                            </div>
                                            <div className="row">
                                                <Field
                                                name="lotNr"
                                                component="input"
                                                type="text"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-6">
                                                        <label>Lot Number</label>
                                                        <input {...input} placeholder="Lot Number"/>
                                                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                                <Field
                                                name="catNr"
                                                component="input"
                                                type="text"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-6">
                                                        <label>Cat Number</label>
                                                        <input {...input} placeholder="Cat Number"/>
                                                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                            </div>
                                            <div className="row">
                                                <Field
                                                name="expiryDate"
                                                component="input"
                                                type="date"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-6">
                                                        <label>Expiry Date</label>
                                                        <input {...input}/>
                                                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                                <Field
                                                name="dateReceived"
                                                component="input"
                                                type="date"
                                                validate={required}
                                                >
                                                {({ input, meta }) => (
                                                    <div className="col-6">
                                                        <label>Date Received</label>
                                                        <input {...input}/>
                                                        {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                                                    </div>
                                                )}
                                                </Field>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <label>Storage Location</label>
                                                    <Field
                                                    name="storageLocation"
                                                    component="select"
                                                    defaultValue={this.state.storageLocation}
                                                    >
                                                        <option selected value="Room 1">Room 1</option>
                                                        <option value="Room 2">Room 2</option>
                                                        <option value="Room 3">Room 3</option>
                                                    </Field>
                                                </div>
                                                <div className="col-6">
                                                    <label className="mr-5">Status</label>
                                                    <Field
                                                    name="status"
                                                    component="select"
                                                    defaultValue={this.state.status}
                                                    >
                                                        <option selected value="OK">OK</option>
                                                        <option value="DISPOSED">DISPOSED</option>
                                                    </Field>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    <label>Condition</label>
                                                </div>
                                                <div className="col-9">
                                                    <Field
                                                    name="condition"
                                                    component="input"
                                                    type="text"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    <label>Comment</label>
                                                </div>
                                                <div className="col-9">
                                                    <Field
                                                    name="comment"
                                                    component="input"
                                                    type="textarea"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    <label>Action</label>
                                                </div>
                                                <div className="col-9">
                                                    <Field
                                                    name="action"
                                                    component="input"
                                                    type="textarea"
                                                    />
                                                </div>
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
                                                        Save Changes
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

export default EditReagent;
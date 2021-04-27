import React, { Component } from 'react';
import { Modal, Button}  from "react-bootstrap";
import { Form, Field } from 'react-final-form';

const required = value => (value ? undefined : 'Required')

class EditSecReagent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reagentName: '',
            lotNr: '',
            expiryDate: null,
            status: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ reagentName: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.reagentName : ''});
        this.setState({ lotNr: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.lotNr : ''});
        this.setState({ expiryDate: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.expiryDate.substring(0, 10) : null});
        this.setState({ status: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.status : ''});
    }      

    handleSubmit = (values) => {
        var expiryDate = new Date(values.expiryDate);
        expiryDate = expiryDate.toISOString();

        var updatedReagent = {
            _id: this.props.selectedRow.selectedFlatRows._id,
            reagentName: values.reagentName,
            lotNr: values.lotNr,
            expiryDate: expiryDate,
            status: values.status
        }

        if ((values.status != this.state.status) && (values.status=="DISPOSED")) {
            var action = "dispose"    
        }
        else {
            var action = "editDetails"
        }

        this.props.putSecReagent(updatedReagent, action);

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
                                lotNr: this.state.lotNr,
                                expiryDate: this.state.expiryDate,
                                status: this.state.status
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

export default EditSecReagent;
import React, { Component } from 'react';
import { FaTimes } from 'react-icons/fa'
import { Form, Field } from 'react-final-form';
import equal from "fast-deep-equal";

const required = value => (value ? undefined : 'Required')

class AddReagent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        reagentName: '',
        supplier: '',
        lotNr: '',
        catNr: '',
        expiryDate: null,
        dateReceived: null,
        storageLocation: null,
        unit: null
      }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ reagentName: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.reagentName : ''});
        this.setState({ supplier: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.supplier : ''});
        this.setState({ lotNr: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.lotNr : ''});
        this.setState({ catNr: nextProps.selectedRow.selectedFlatRows ? nextProps.selectedRow.selectedFlatRows.catNr : ''});
    }

    handleSubmit = async values => {
        var expiryDate = new Date(values.expiryDate);
        expiryDate = expiryDate.toISOString();
        var dateReceived = new Date(values.dateReceived);
        dateReceived = dateReceived.toISOString();

        var times = Number(values.unit);
        
        for (var i=0; i<times; i++) {
            var unit = String(i+1) + "/" + String(times)
            this.props.postReagent(
                unit,
                values.reagentName, 
                values.supplier,
                values.lotNr,
                values.catNr,
                expiryDate,
                dateReceived,
                values.storageLocation)
        }        
    }

    render() {        
      return(        
        <div style={{"z-index":"11"}} className={`sidebar-content${this.props.isSidebarOpen === true ? ' open' : ''}`}>
            <Form
                onSubmit={this.handleSubmit}
                initialValues={{ 
                    reagentName: this.state.reagentName,
                    supplier: this.state.supplier,
                    lotNr: this.state.lotNr,
                    catNr: this.state.catNr,
                    storageLocation: "Room 1",
                    unit: 1
                }}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                    <div className="container-fluid">
                        <div className="row mt-2">
                            <div className="col-1">
                                <a onClick={() => {
                                    this.props.onSidebarToggle();
                                    var fields = form.getRegisteredFields()
                                    fields.map(field => form.resetFieldState(field));
                                    }}><FaTimes /></a>
                            </div>                                        
                            <div className="col text-center">
                                <h4>Add New Reagent</h4>
                            </div>
                        </div>
                        <div className="row ml-2 mt-2">
                            <div className="container">
                                <form id="addReagentForm" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <Field
                                        name="reagentName"
                                        component="input"
                                        type="text"
                                        validate={required}
                                        >
                                        {({ input, meta }) => (
                                            <div className="col-12">
                                                <label>Reagent Name</label>
                                                <input {...input} placeholder="Reagent Name"/>
                                                {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                                            </div>
                                        )}
                                        </Field>
                                    </div>
                                    <div className="row">
                                        <Field
                                        name="supplier"
                                        component="input"
                                        type="text"
                                        validate={required}
                                        >
                                        {({ input, meta }) => (
                                            <div className="col-12">
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
                                            defaultValue="Room 1"
                                            >
                                                <option value="Room 1">Room 1</option>
                                                <option value="Room 2">Room 2</option>
                                                <option value="Room 3">Room 3</option>
                                            </Field>
                                        </div>
                                        <div className="col-6">
                                            <label>Unit</label>
                                            <Field
                                            name="unit"
                                            component="input"
                                            type="number"
                                            min="1"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <button className="cancel-button" type="button"
                                                        onClick={() => {
                                                            this.props.onSidebarToggle();
                                                            var fields = form.getRegisteredFields()
                                                            fields.map(field => form.resetFieldState(field))
                                                        }}>
                                                        Cancel
                                                    </button>
                                            <button className="submit-button" type="submit" disabled={submitting || pristine}>
                                                Add Reagents
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
      );
    }
}

export default AddReagent;
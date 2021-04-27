import React, { createRef, Component } from "react";
import Sidebar from './Sidebar';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Accordion, Card, Modal, Button}  from "react-bootstrap";


const required = value => (value ? undefined : 'Required')
const mapping = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const RenderAssay = ( props ) => (
    <div className="col-xl-6 assay-cards" style={{"width":"100%"}}>
            <Card style={{"backgroundColor": "white"}} id={props.assayType._id} key={props.assayType._id}>                            
                <Card.Title>
                    <div style={{"marginRight":"10px"}} className="row">
                        <div className="col-10">
                            <h4 style={{"padding":"10px"}}><b>{props.assayType.assayName}</b></h4>
                        </div>
                        <div style={{"paddingTop":"10px", "paddingRight":"10px"}} className="col-1 ml-auto">
                            <a type="button" onClick={() => props.deleteTestType(props.assayType._id)}><FontAwesomeIcon icon={faTimes} color="grey" size='md'/></a>
                        </div>
                    </div>
                </Card.Title>
                <Card.Body>         
                        <div className="row">     
                            <div className="col-12">
                                <h4>Reagents</h4>
                            </div>                           
                            {props.assayType.metadata[0] ? (props.assayType.metadata[0].children.map((reagent, index) => {
                                return(
                                    <>
                                    <div style={{"color":"grey"}} className="col-6" key={reagent.key}>
                                        <b>Reagent&nbsp;Input&nbsp;#{String(index+1)}</b>
                                    </div>
                                    <div className="col-6" key={reagent.key}>
                                        {reagent.label}
                                    </div>
                                    </>
                                );
                            })) : null}
                        </div>                         
                        <div className="row mt-3">                                
                            <div className="col-12">
                                <h4>Reagent Data</h4>
                            </div>
                            {props.assayType.metadata[1] ? (props.assayType.metadata[1].children.map((reagentDataInput, index) => {
                                return(
                                    <>
                                    <div style={{"color":"grey"}} className="col-6" key={reagentDataInput.key}>
                                        <b>Reagent&nbsp;Data&nbsp;#{String(index+1)}</b>
                                    </div>
                                    <div className="col-6" key={reagentDataInput.key}>
                                        {reagentDataInput.label}
                                    </div>
                                    </>
                                );
                            })) : null}
                        </div>
                        <div className="row mt-3">  
                            <div className="col-12">
                                <h4>Other</h4>
                            </div>                              
                            {props.assayType.metadata[2] ? (props.assayType.metadata[2].children.map((otherInput, index) => {
                                return(
                                    <>
                                    <div style={{"color":"grey"}} className="col-6" key={otherInput.key}>
                                        <b>Other&nbsp;Input&nbsp;#{String(index+1)}</b>
                                    </div>
                                    <div className="col-6" key={otherInput.key}>
                                        {otherInput.label}
                                    </div>
                                    </>
                                );
                            })) : null}
                        </div>                      
                </Card.Body>
            </Card>
        </div> 
    )


class AssayTypes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            assayTypes: props.testTypes,
            dateSeries: [],
            monthCounter: []
        }
    }

    componentDidMount() {
        var dateSeries = this.state.assayTypes.map(assayType => new Date(assayType.createdAt));
        dateSeries.sort();
        dateSeries = dateSeries.map(date => date.toISOString().substring(0, 7))
        dateSeries = [...new Set(dateSeries)]
        
        this.setState({
            dateSeries: dateSeries
        });
    }

    addToMonthCounter(date) {
        this.setState(prevState => ({
            monthCounter: [...prevState.monthCounter, date]
        }))
        console.log(this.state.monthCounter);
    }

    handleSubmit = async values => {
        var newAssayType = {
            assayName: values.assayName,
            metadata: [
                {
                    key: "reagents",
                    children: []
                },
                {
                    key: "reagentData",
                    children: []
                },
                {
                    key: "other",
                    children: []
                }
            ]
        };

        if (values.reagents) {
            var reagentChildren = values.reagents.filter(inputField => inputField != null);
            reagentChildren = reagentChildren.map(inputField => {
                let key = inputField.label.toLowerCase();
                key = key.replace(" ","_");
                return(
                    {
                        key: key,
                        label: inputField.label,
                        required: true,
                        type: "reagent"
                    }
                );
            });
            newAssayType.metadata[0].children = reagentChildren;
        }

        if (values.reagentData) {
            var reagentDataChildren = values.reagentData.filter(inputField => inputField.label != null);
            reagentDataChildren = reagentDataChildren.map(inputField => {
                let key = inputField.label.toLowerCase();
                key = key.replace(" ","_");
                return(
                    {
                        key: key,
                        label: inputField.label,
                        required: inputField.required,
                        type: inputField.type
                    }
                );
            });

            newAssayType.metadata[1].children = reagentDataChildren;
        }
        
        if (values.other) {
            var otherDataChildren = values.other.filter(inputField => inputField.label != null);
            var otherDataChildren = otherDataChildren.map(inputField => {
                let key = inputField.label.toLowerCase();
                key = key.replace(" ","_");
                return(
                    {
                        key: key,
                        label: inputField.label,
                        required: inputField.required,
                        type: inputField.type
                    }
                );
            });

            newAssayType.metadata[2].children = otherDataChildren;
        }
        
        this.props.postTestType(newAssayType);
        //alert(JSON.stringify(newAssayType))
    }

    childRef = createRef();

    render() {
        return(
            <div id="page-wrap" className="container-fluid">         
                <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} logoutUser={this.props.logoutUser} />                               
                <div style={{"z-index":"10", "position":"fixed", "border-bottom":"1px solid #E2E2E4", "background-color": "white", "margin-top": "0px", "padding": "10px", "width":"110%"}} className="row header">
                            <div className="col my-auto ml-5">
                                <span className="menu-header"> Assay Types </span>
                            </div>
                        </div>
                <div className="row min-vh-100">
                    <div className="col-4 d-none d-lg-block">
                        <div style={{"border-right":"1px solid #E2E2E4", "paddingTop":"81px"}} className="row side-info d-flex flex-column h-100">
                            <div className="col">
                                <div style={{"border-radius": "7px",
                                                        "background-color": "rgba(47, 73, 209, 0.15)",                                                    
                                                        "box-shadow": "0px 0px 5px 0px lightgrey", 
                                                        "paddingTop":"10px", "paddingBottom":"10px"}} className="container">
                                <Form 
                                    onSubmit={this.handleSubmit}
                                    mutators={{
                                    ...arrayMutators
                                    }}
                                    render={({
                                    handleSubmit,
                                    form: {
                                        mutators: { push, pop }
                                    }, // injected from final-form-arrays above
                                    pristine,
                                    form,
                                    submitting,
                                    values
                                    }) => {
                                        return(
                                            <form id="addAssayType" onSubmit={handleSubmit}>
                                                <div className="container">
                                                    <Field
                                                        name="assayName"
                                                        component="input"
                                                        type="text"
                                                        validate={required}
                                                        >
                                                        {({ input, meta }) => (
                                                            <div className="row">                                  
                                                                <div className="col-12 col-xl-6">
                                                                    <input {...input} id="assay-name-input" placeholder="Assay Name..."/>
                                                                    {meta.error && meta.submitFailed && <span>{meta.error}</span>}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Field>
                                                    <div className="row input-header">
                                                        <div className="col-12">
                                                            <span className="input-h4">Reagents</span>   
                                                            <span style={{"white-space": "nowrap"}}>
                                                                <button className="button-form-array" type="button" onClick={() => push('reagents', undefined)}>
                                                                    <FontAwesomeIcon icon={faPlus} color="#3e8bd6" size='md'/>
                                                                </button>&nbsp;
                                                                <button className="button-form-array" type="button" onClick={() => pop('reagents')}>
                                                                    <FontAwesomeIcon icon={faMinus} color="#3e8bd6" size='md'/>
                                                                </button>
                                                            </span>                                                     
                                                        </div>
                                                    </div>
                                                    <FieldArray name="reagents">
                                                        {({ fields }) =>
                                                            fields.map((name, index) => (
                                                            <div className="row" key={name}>
                                                                {/*<label>Reagent #{index + 1}</label>*/}
                                                                <div className="col-10 col-xl-6">
                                                                    <Field
                                                                    name={`${name}.label`}
                                                                    component="input"
                                                                    placeholder="Reagent Name"
                                                                    />
                                                                </div>
                                                                <div className="col-1 my-auto">
                                                                    <span
                                                                    onClick={() => fields.remove(index)}
                                                                    style={{ cursor: 'pointer' }}
                                                                    >
                                                                    <FontAwesomeIcon icon={faTimes} color="grey" size='md'/>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            ))
                                                        }
                                                    </FieldArray> 
                                                </div>
                                                <div className="container">
                                                    <div className="row input-header">
                                                        <div className="col-12">
                                                            <span className="input-h4">Reagent Data</span>
                                                            <button className="button-form-array" type="button" onClick={() => push('reagentData', undefined)}>
                                                                <FontAwesomeIcon icon={faPlus} color="#3e8bd6" size='md'/>
                                                            </button>{' '}
                                                            <button className="button-form-array" type="button" onClick={() => pop('reagentData')}>
                                                                <FontAwesomeIcon icon={faMinus} color="#3e8bd6" size='md'/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <FieldArray name="reagentData">
                                                        {({ fields }) =>
                                                            fields.map((name, index) => (
                                                            <div className="row" key={name}>
                                                                {/*<label>{index + 1}</label>*/}
                                                                <div className="col-5 xl-col-6">
                                                                    <Field
                                                                    name={`${name}.label`}
                                                                    component="input"
                                                                    placeholder="Input Name"
                                                                    />
                                                                </div>
                                                                <div className="col-2">
                                                                    <Field
                                                                    name={`${name}.type`}
                                                                    component="select"
                                                                    defaultValue="text"
                                                                    >
                                                                        <option selected value="text">Text</option>
                                                                        <option value="date">Date</option>
                                                                    </Field>
                                                                </div>
                                                                <div className="col-3">
                                                                    <Field
                                                                    name={`${name}.required`}
                                                                    component="select"
                                                                    defaultValue="true"
                                                                    >
                                                                        <option selected value="true">Required</option>
                                                                        <option value="false">Not Required</option>
                                                                    </Field>
                                                                </div>
                                                                <div className="col-1 my-auto">
                                                                    <span
                                                                    onClick={() => fields.remove(index)}
                                                                    style={{ cursor: 'pointer' }}
                                                                    >
                                                                    <FontAwesomeIcon icon={faTimes} color="grey" size='md'/>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            ))
                                                        }
                                                    </FieldArray>
                                                    <div className="row input-header">
                                                        <div className="col-12"><span className="input-h4">Other Inputs</span>
                                                            <button className="button-form-array" type="button" onClick={() => push('other', undefined)}>
                                                                <FontAwesomeIcon icon={faPlus} color="#3e8bd6" size='md'/>
                                                            </button>{' '}
                                                            <button className="button-form-array" type="button" onClick={() => pop('other')}>
                                                                <FontAwesomeIcon icon={faMinus} color="#3e8bd6" size='md'/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <FieldArray name="other">
                                                        {({ fields }) =>
                                                            fields.map((name, index) => (
                                                            <div className="row" key={name}>
                                                                {/*<label>{index + 1}</label>*/}
                                                                <div className="col-5 xl-col-6">
                                                                    <Field
                                                                    name={`${name}.label`}
                                                                    component="input"
                                                                    placeholder="Input Name"
                                                                    />
                                                                </div>
                                                                <div className="col-2">
                                                                    <Field
                                                                    name={`${name}.type`}
                                                                    component="select"
                                                                    defaultValue="text"
                                                                    >
                                                                        <option selected value="text">Text</option>
                                                                        <option value="date">Date</option>
                                                                    </Field>
                                                                </div>
                                                                <div className="col-3">
                                                                    <Field
                                                                    name={`${name}.required`}
                                                                    component="select"
                                                                    defaultValue="true"
                                                                    >
                                                                        <option selected value="true">Required</option>
                                                                        <option value="false">Not Required</option>
                                                                    </Field>
                                                                </div>
                                                                <div className="col-1 my-auto">
                                                                    <span
                                                                    onClick={() => fields.remove(index)}
                                                                    style={{ cursor: 'pointer' }}
                                                                    >
                                                                    <FontAwesomeIcon icon={faTimes} color="grey" size='md'/>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            ))
                                                        }
                                                    </FieldArray>
                                                    <div className="container">
                                                        <div className="row">
                                                            <button className="submit-button" type="submit" disabled={submitting || pristine}>
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        )
                                    }
                                }/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">  
                        <div style={{"padding-top":"81px", "paddingRight":"15px"}} className="row">
                            <div className="col">
                            <Accordion defaultActiveKey="0">
                                <Card key="0" style={{"display": this.state.dateSeries[0] ? "block": "none"}}>
                                    <Card.Header>
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                                            {this.state.dateSeries[0] ? String(mapping[Number(this.state.dateSeries[0].substring(5, 7))-1]) + ' ' + String(this.state.dateSeries[0].substring(0, 4)) : null}
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                <div className="container">
                                                    <div className="row">
                                                    {this.state.dateSeries[0] ? (this.state.assayTypes.map(assayType => {
                                                    if (Number(assayType.createdAt.substring(5,7)) == this.state.dateSeries[0].substring(5,7)) {
                                                            return(
                                                                <RenderAssay ref={this.childRef} key={assayType._id} assayType={assayType}
                                                                    deleteTestType={this.props.deleteTestType} />
                                                            );
                                                        }
                                                        else {
                                                            return(
                                                                <div></div>
                                                            );
                                                        }
                                                    })): null}
                                                    </div>
                                                </div>
                                            </Card.Body>                                                    
                                        </Accordion.Collapse>
                                    </Card.Header>
                                </Card>
                                {this.state.dateSeries.map(date => {
                                    if (date != this.state.dateSeries[0]) {
                                        return(
                                            <Card key={date.substring(0, 7)}>
                                                <Card.Header>
                                                    <Accordion.Toggle as={Card.Header} variant="link" eventKey={date.substring(5, 7)}>
                                                        <a type="button">{String(mapping[Number(date.substring(5, 7))-1]) + ' ' + String(date.substring(0, 4))}</a>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={date.substring(5, 7)}>
                                                        <Card.Body>
                                                            <div className="row">
                                                                {this.state.assayTypes.map(assayType => {
                                                                    if (Number(assayType.createdAt.substring(5,7)) == date.substring(5,7)) {
                                                                        return(
                                                                            <>
                                                                            <RenderAssay ref={this.childRef} key={assayType._id} assayType={assayType}
                                                                                deleteTestType={this.props.deleteTestType} />
                                                                            </>
                                                                        );
                                                                    }
                                                                    else {
                                                                        return(
                                                                            null
                                                                        );
                                                                    }
                                                                })}
                                                            </div>
                                                        </Card.Body>                                                    
                                                    </Accordion.Collapse>
                                                </Card.Header>
                                            </Card>
                                        );
                                    }  
                                })}                                         
                            </Accordion> 
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        );
    }
}

export default AssayTypes;
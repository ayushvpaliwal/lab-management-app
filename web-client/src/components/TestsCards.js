import React, { Component } from 'react';
import { format } from 'date-fns';

class TestsCards extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="container-fluid">
            <div style={{"padding":"20px"}} className="row">
                <div style={{"borderRight":"1px solid lightgrey"}} className="col-6">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <h4>Reagents</h4>
                        </div>
                    </div>
                    {this.props.testValues.reagents ? (this.props.testValues.reagents.map(reagent => (
                        <div className="row reagent-card-value">
                            <div className="col">
                                <b>{reagent.label}</b>
                            </div>
                            <div className="col">
                                {reagent.lotNr}
                            </div>
                        </div>
                    ))) : ''}
                </div>
                <div className="col-6">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <h4>Reagent Data</h4>
                        </div>
                    </div>
                    {this.props.testValues.reagentData ? (this.props.testValues.reagentData.map(reagentData => (
                        <div className="row reagent-card-value">
                            <div className="col">
                                <b>{reagentData.label}</b>
                            </div>
                            <div className="col">
                                {reagentData.type=="date" ? (
                                    (reagentData.value!=null ? format(new Date(reagentData.value), 'dd/MM/yyyy'): '')
                                ) : (
                                    reagentData.value
                                ) }
                            </div>
                        </div>
                    ))) : ''}
                </div>
            </div>
            <div style={{"padding":"20px", "borderTop":"1px solid lightgrey"}} className="row">    
                <div style={{"borderRight":"1px solid lightgrey"}} className="col-6">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <h4>Other Data</h4>
                        </div>
                    </div>
                    {this.props.testValues.other ? (this.props.testValues.other.map(otherData => (
                        <div className="row reagent-card-value">
                            <div className="col">
                                <b>{otherData.label}</b>
                            </div>
                            <div className="col">
                                {otherData.type=="date" ? (
                                    (otherData.value!=null ? format(new Date(otherData.value), 'dd/MM/yyyy'): '')
                                ) : (
                                    otherData.value
                                ) }
                            </div>
                        </div>
                    ))) : ''}
                </div>
                <div className="col-6">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <h4>Equipment</h4>
                        </div>
                    </div>
                    {this.props.testValues.equipment ? (this.props.testValues.equipment.map((equipment, index) => (
                        <div className="row reagent-card-value">
                            <div className="col">
                                {String(index+1) + ". " + equipment.eqptNr}
                            </div>
                        </div>
                    ))) : ''}
                </div>
            </div>
            </div>
        );
    }
}

export default TestsCards;
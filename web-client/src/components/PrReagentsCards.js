import React, { Component } from 'react';
import { format } from 'date-fns';

class PrReagentsCards extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div style={{"padding":"20px"}} className="row">
                <div style={{"borderRight":"1px solid lightgrey"}} className="col-4">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>First Used By</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.firstUsedBy}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Received By</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.receivedBy}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Last Edited By</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.lastEditedBy}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Disposed By</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.discardedBy}
                        </div>
                    </div>
                </div>
                <div style={{"borderRight":"1px solid lightgrey"}} className="col-4">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Storage Location</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.storageLocation}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Condition</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.condition}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Action</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.action}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Comment</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.comment}
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Status</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.status}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Date Received</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.dateReceived!=null ? 
                                format(new Date(this.props.reagentValues.dateReceived), 'dd/MM/yyyy') : 
                                ''}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Date of First Use</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.dateOfFirstUse!=null ? 
                                format(new Date(this.props.reagentValues.dateOfFirstUse), 'dd/MM/yyyy') : 
                                ''}
                        </div>
                    </div>
                    <div className="row reagent-card-value">
                        <div className="col">
                            <b>Expiry Date</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.expiryDate!=null ? 
                                format(new Date(this.props.reagentValues.expiryDate), 'dd/MM/yyyy') : 
                                ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrReagentsCards;
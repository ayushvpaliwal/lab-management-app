import React, { Component } from 'react';
import { format } from 'date-fns';

class SecReagentsCards extends Component {
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
                            <b>Created By</b>
                        </div>
                        <div className="col">
                            {this.props.reagentValues.createdBy}
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
                <div className="col-8">
                    <div className="row reagent-card-value">
                        <div className="col">
                            <h4>Compositions</h4>
                        </div>
                    </div>
                    {this.props.reagentValues.reagents ? (this.props.reagentValues.reagents.map((reagent, index) => (
                        <div className="row reagent-card-value">
                            <div className="col col-1">
                                <b>{index+1}.</b>
                            </div>
                            <div className="col col-2">
                                <b>LOT Number</b>
                            </div>
                            <div className="col">
                                {reagent.lotNr}
                            </div>
                            <div className="col col-2">
                                <b>Reagent Name</b>
                            </div>
                            <div className="col">
                                {reagent.reagentName}
                            </div>
                        </div>
                    ))) : ''}
                </div>
            </div>
        );
    }
}

export default SecReagentsCards;
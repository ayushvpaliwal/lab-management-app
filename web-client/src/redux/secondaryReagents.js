import * as ActionTypes from './ActionTypes';

export const SecReagents = (state = {
    errMess: null,
    isLoading: true,
    secReagents: [],
    deletedSecReagents: []
}, action) => {
    switch(action.type) {
        case ActionTypes.RENDER_SEC_REAGENTS:
            console.log(action.payload);
            return {...state, isLoading: false, errMess: null, secReagents: action.payload}

        case ActionTypes.RENDER_DELETED_SEC_REAGENTS:
            console.log(action.payload);
            return {...state, isLoading: false, errMess: null, deletedSecReagents: action.payload}
        
        case ActionTypes.SEC_REAGENTS_LOADING:
            return {...state, isLoading: true, errMess: null, secReagents: [], deletedSecReagents: []}

        case ActionTypes.SEC_REAGENTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, secReagents: [], deletedSecReagents: []}

        case ActionTypes.UPDATE_SEC_REAGENT:
            var secReagent = action.payload;
            if (secReagent.status == "DELETED") {
                return {...state, secReagents: state.secReagents.filter(
                            item => item._id !== secReagent._id
                        ), deletedSecReagents: state.deletedSecReagents.concat(secReagent)};
            }
            else {
                var secReagentsCopy = state.secReagents.slice()
                var foundIndex = secReagentsCopy.findIndex(entry => entry._id == secReagent._id);
                secReagentsCopy[foundIndex] = secReagent;

                var deletedSecReagentsCopy = state.deletedSecReagents.filter(
                    item => item._id !== secReagent._id
                )

                return {...state, secReagents: secReagentsCopy, deletedSecReagents: deletedSecReagentsCopy}
            }
       
        case ActionTypes.REMOVE_SEC_REAGENT:
            var secReagent = action.payload._id;
            return {...state, secReagents: state.secReagents.filter(
                item => item._id !== secReagent
            )};

        default:
            return state;
    }
}
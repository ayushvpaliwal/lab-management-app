import * as ActionTypes from './ActionTypes';

export const Reagents = (state = {
    errMess: null,
    isLoading: true,
    reagents: [],
    deletedReagents: []
}, action) => {
    switch(action.type) {
        case ActionTypes.RENDER_REAGENTS:
            console.log(action.payload);
            return {...state, isLoading: false, errMess: null, reagents: action.payload}
        
        case ActionTypes.RENDER_DELETED_REAGENTS:
            console.log(action.payload);
            return {...state, isLoading: false, errMess: null, deletedReagents: action.payload}
        
        case ActionTypes.REAGENTS_LOADING:
            return {...state, isLoading: true, errMess: null, reagents: [], deletedReagents: []}

        case ActionTypes.REAGENTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, reagents: [], deletedReagents: []}

        case ActionTypes.ADD_REAGENT:
            var reagent = action.payload;
            return {...state, reagents: state.reagents.concat(reagent)};

        case ActionTypes.UPDATE_REAGENT:
            var reagent = action.payload;

            if (reagent.status == "DELETED") {
                return {...state, reagents: state.reagents.filter(
                            item => item._id !== reagent._id
                        ), deletedReagents: state.deletedReagents.concat(reagent)};
            }
            else {
                var reagentsCopy = state.reagents.slice()
                var foundIndex = reagentsCopy.findIndex(entry => entry._id == reagent._id);
                reagentsCopy[foundIndex] = reagent;

                var deletedReagentsCopy = state.deletedReagents.filter(
                    item => item._id !== reagent._id
                )

                return {...state, reagents: reagentsCopy, deletedReagents: deletedReagentsCopy}
            }
       
        case ActionTypes.REMOVE_REAGENT:
            var reagent = action.payload._id;
            return {...state, reagents: state.reagents.filter(
                item => item._id !== reagent
            )};

        default:
            return state;
    }
}
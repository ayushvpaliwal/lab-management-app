import * as ActionTypes from './ActionTypes';

export const TestTypes = (state = {
    errMess: null,
    testTypes: []
}, action) => {
    switch(action.type) {
        case ActionTypes.RENDER_TESTTYPES:
            return {...state, isLoading: false, errMess: null, testTypes: action.payload}

        case ActionTypes.TESTTYPES_LOADING:
            return {...state, isLoading: true, errMess: null, reagents: []}

        case ActionTypes.TESTTYPES_FAILED:
            return {...state, isLoading: false, errMess: action.payload, testTypes: []}

        case ActionTypes.ADD_TESTTYPE:
            var testType = action.payload;
            return {...state, testTypes: state.testTypes.concat(testType)};

        case ActionTypes.UPDATE_TESTTYPE:
            var testType = action.payload;
            return {...state, testTypes: state.testTypes.filter(testType => testType.status != "DELETED")};
       
        case ActionTypes.REMOVE_TESTTYPE:
            var testType = action.payload;
            return {...state, testTypes: state.testTypes.filter(
                item => item._id !== testType._id
            )};

        default:
            return state;
    }
}
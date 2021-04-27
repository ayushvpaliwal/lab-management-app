import * as ActionTypes from './ActionTypes';

export const Tests = (state = {
        isLoading: true,
        errMess: null,
        tests: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.RENDER_TESTS:
            return {...state, isLoading: false, errMess: null, tests: action.payload}

        case ActionTypes.TESTS_LOADING:
           return {...state, isLoading: true, errMess: null, tests: []}

        case ActionTypes.TESTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, tests: []}

        case ActionTypes.UPDATE_TEST:
            var test = action.payload;

            if (test.status == "DELETED") {
                return {...state, tests: state.tests.filter(
                            item => item._id !== test._id
                        )};
            }

        case ActionTypes.REMOVE_TEST:
            var test = action.payload._id;
            return {...state, tests: state.tests.filter(
                item => item._id !== test
            )};

        default:
            return state;
    }
}
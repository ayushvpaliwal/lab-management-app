import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseURL';
import { TestTypes } from './testTypes';

///////////////////////////////////////////////////
// AUTH
///////////////////
// LOGIN
export const checkJWTToken = () => (dispatch) => {
    
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'users/checkJWTToken', {
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
          }
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
            }
            else if (!response.success) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                var error = new Error('Error ' + response.err.name);
                error.response = response;
                throw error;
            }
            else {
                var error = new Error('Error ' + response.status);
                error.response = response;
                throw error;
            }
        })
        .catch(error => dispatch(loginError(error.message)))
};



export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API

    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            localStorage.setItem("showDeletedUsers", false);
            // Dispatch the success action
            dispatch(requestLogin(response.user));
            dispatch(receiveLogin(response));
        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error.message)))
};

export const requestLogin = (userData) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        userData
    }
}
  
export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

// LOGOUT
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    localStorage.removeItem("showDeletedUsers");
    dispatch(receiveLogout())
}

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}
///////////////////////////////////////////////////

///////////////////////////////////////////////////
// USERS
///////////////////
// GET
export const fetchUsers = () => (dispatch) => {
    
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'users', {
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
          }
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(users => dispatch(renderUsers(users)))
        .catch(error => dispatch(usersFailed(error.message)));
}

export const usersLoading = () => ({
    type: ActionTypes.USERS_LOADING
});

export const renderUsers = (users) => ({
    type: ActionTypes.RENDER_USERS,
    payload: users
});

export const usersFailed = (errmess) => ({
    type: ActionTypes.USERS_FAILED,
    payload: errmess
});

// POST
export const postUser = (user) => (dispatch) => {
    
    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'users/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearer
      },
      body: JSON.stringify(user)
    })
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
        error => {
          throw error;
        })
      .then(response => response.json())
      .then(response => dispatch(addUser(response.user)))
      .catch(error => { console.log('User', error.message); alert("Registration failed")});
};

export const addUser = (user) => ({
    type: ActionTypes.ADD_USER,
    payload: user
});

// PUT
export const putUser = (
    updatedUser, setpassword=false
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'users/' + updatedUser._id + '?setpassword=' + setpassword, {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(updateUser(response))})
        .catch(error => { console.log('Update User Info.', error.message) 
            alert('Update could not be performed. \nError: '+ error.message)})
}

export const updateUser = (user) => ({
    type: ActionTypes.UPDATE_USER,
    payload: user
});

///////////////////////////////////////////////////

///////////////////////////////////////////////////
// PRIMARY REAGENTS
///////////////////
// GET
export const fetchReagents = (deleted=false) => (dispatch) => {
    
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'reagents' + "?deleted=" + deleted, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
          }
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(reagents => dispatch(renderReagents(reagents)))
        .catch(error => dispatch(reagentsFailed(error.message)));
}

// GET DELETED
export const fetchDeletedReagents = (deleted=true) => (dispatch) => {
    
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'reagents' + "?deleted=" + deleted, {
            headers: { 
                'Content-Type':'application/json',
                'Authorization': bearer
            }
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(reagents => dispatch(renderDeletedReagents(reagents)))
        .catch(error => dispatch(reagentsFailed(error.message)));
}

export const reagentsLoading = () => ({
    type: ActionTypes.REAGENTS_LOADING
});

export const renderReagents = (reagents) => ({
    type: ActionTypes.RENDER_REAGENTS,
    payload: reagents
});

export const renderDeletedReagents = (deletedReagents) => ({
    type: ActionTypes.RENDER_DELETED_REAGENTS,
    payload: deletedReagents
});

export const reagentsFailed = (errmess) => ({
    type: ActionTypes.REAGENTS_FAILED,
    payload: errmess
});

// POST
export const postReagent = (
    unit,
    reagentName,
    supplier,
    lotNr,
    catNr,
    expiryDate,
    dateReceived,
    storageLocation
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    const newReagent = {
        unit: unit,
        reagentName: reagentName,
        supplier: supplier,
        lotNr: lotNr,
        catNr: catNr,
        expiryDate: expiryDate,
        dateReceived: dateReceived,
        storageLocation: storageLocation
    }

    return fetch(baseUrl + 'reagents', {
        method: 'POST',
        body: JSON.stringify(newReagent),
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => dispatch(addReagent(response)))
        .catch(error => { console.log('Post reagents', error.message) 
            alert('Reagent could not be posted\nError: '+ error.message)})
}

export const addReagent = (reagent) => ({
    type: ActionTypes.ADD_REAGENT,
    payload: reagent
});

// PUT
export const putReagent = (
    updatedReagent, action = ""
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'reagents/' + updatedReagent._id 
    + "?action=" + action, {
        method: 'PUT',
        body: JSON.stringify(updatedReagent),
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(updateReagent(response))})
        .catch(error => { console.log('Post reagents', error.message) 
            alert('Reagent could not be posted\nError: '+ error.message)})
}

export const updateReagent = (reagent) => ({
    type: ActionTypes.UPDATE_REAGENT,
    payload: reagent
});

// DELETE
export const deleteReagent = (
    reagent_id
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'reagents/' + reagent_id, {
        method: 'DELETE',
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(removeReagent(response))})
        .catch(error => { console.log('Delete reagents', error.message) 
            alert('Reagent could not be deleted\nError: '+ error.message)})
        
}

export const removeReagent = (reagent) => ({    
    type: ActionTypes.REMOVE_REAGENT,
    payload: reagent
});
///////////////////////////////////////////////////

///////////////////////////////////////////////////
// SECONDARY REAGENTS
///////////////////
// GET
export const fetchSecReagents = (deleted=false) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'secondary-reagents' + "?deleted=" + deleted, {
            headers: { 
                'Content-Type':'application/json',
                'Authorization': bearer
            },
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(secReagents => dispatch(renderSecReagents(secReagents)))
        .catch(error => dispatch(secReagentsFailed(error.message)));
}

// GET DELETED
export const fetchDeletedSecReagents = (deleted=true) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'secondary-reagents' + "?deleted=" + deleted, {
            headers: { 
                'Content-Type':'application/json',
                'Authorization': bearer
            },
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(deletedSecReagents => dispatch(renderSecDeletedReagents(deletedSecReagents)))
        .catch(error => dispatch(secReagentsFailed(error.message)));
}

export const secReagentsLoading = () => ({
    type: ActionTypes.SEC_REAGENTS_LOADING
});

export const renderSecReagents = (secReagents) => ({
    type: ActionTypes.RENDER_SEC_REAGENTS,
    payload: secReagents
});

export const renderSecDeletedReagents = (deletedSecReagents) => ({
    type: ActionTypes.RENDER_DELETED_SEC_REAGENTS,
    payload: deletedSecReagents
});

export const secReagentsFailed = (errmess) => ({
    type: ActionTypes.SEC_REAGENTS_FAILED,
    payload: errmess
});

// PUT
export const putSecReagent = (
    updatedSecReagent, action = ""
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'secondary-reagents/' + updatedSecReagent._id 
    + "?action=" + action, {
        method: 'PUT',
        body: JSON.stringify(updatedSecReagent),
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(updateSecReagent(response))})
        .catch(error => { console.log('Post reagents', error.message) 
            alert('Reagent could not be posted\nError: '+ error.message)})
}

export const updateSecReagent = (secReagent) => ({
    type: ActionTypes.UPDATE_SEC_REAGENT,
    payload: secReagent
});

// DELETE
export const deleteSecReagent = (
    secReagent_id
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'secondary-reagents/' + secReagent_id, {
        method: 'DELETE',
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(removeSecReagent(response))})
        .catch(error => { console.log('Delete reagents', error.message) 
            alert('Reagent could not be deleted\nError: '+ error.message)})
        
}

export const removeSecReagent = (secReagent) => ({    
    type: ActionTypes.REMOVE_SEC_REAGENT,
    payload: secReagent
});
///////////////////////////////////////////////////

///////////////////////////////////////////////////
// TESTS
////////
// GET
export const fetchTests = () => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'tests', {
            headers: { 
                'Content-Type':'application/json',
                'Authorization': bearer
            },
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(tests => dispatch(renderTests(tests)))
        .catch(error => dispatch(testsFailed(error.message)));
}

export const testsLoading = () => ({
    type: ActionTypes.TESTS_LOADING
});

export const renderTests = (tests) => ({
    type: ActionTypes.RENDER_TESTS,
    payload: tests
});

export const testsFailed = (errmess) => ({
    type: ActionTypes.TESTS_FAILED,
    payload: errmess
});

// PUT
export const putTest = (
    updatedTest
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'tests/' + updatedTest._id, {
        method: 'PUT',
        body: JSON.stringify(updatedTest),
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(updateTest(response))})
        .catch(error => { console.log('Post reagents', error.message) 
            alert('Reagent could not be posted\nError: '+ error.message)})
}

export const updateTest = (updatedTest) => ({
    type: ActionTypes.UPDATE_TEST,
    payload: updatedTest
});

// DELETE
export const deleteTest = (
    test_id
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'tests/' + test_id, {
        method: 'DELETE',
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(removeTest(response))})
        .catch(error => { console.log('Delete reagents', error.message) 
            alert('Reagent could not be deleted\nError: '+ error.message)})
        
}

export const removeTest = (test) => ({    
    type: ActionTypes.REMOVE_TEST,
    payload: test
});
///////////////////////////////////////////////////

///////////////////////////////////////////////////
// TEST TYPES
/////////////
// GET
export const fetchTestTypes = () => (dispatch) => {
    
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'test-types', {
            headers: { 
                'Content-Type':'application/json',
                'Authorization': bearer
            },
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(testTypes => dispatch(renderTestTypes(testTypes)))
        .catch(error => dispatch(reagentsFailed(error.message)));
}

export const testTypesLoading = () => ({
    type: ActionTypes.TESTTYPES_LOADING
});

export const renderTestTypes = (testTypes) => ({
    type: ActionTypes.RENDER_TESTTYPES,
    payload: testTypes
});

export const testTypesFailed = (errmess) => ({
    type: ActionTypes.TESTTYPES_FAILED,
    payload: errmess
});

// POST
export const postTestType = (
    newTestType
) => (dispatch) => {
    
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'test-types', {
        method: 'POST',
        body: JSON.stringify(newTestType),
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => dispatch(addTestType(response)))
        .catch(error => { console.log('Post reagents', error.message) 
            alert('Reagent could not be posted\nError: '+ error.message)})
}

export const addTestType = (testType) => ({
    type: ActionTypes.ADD_TESTTYPE,
    payload: testType
});

// DELETE
export const deleteTestType = (
    testType_id
) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    
    return fetch(baseUrl + 'test-types/' + testType_id, {
        method: 'DELETE',
        headers: { 
            'Content-Type':'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText)
                error.response = response;
                throw error;
            }
        }, 
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(response => {dispatch(removeTestType(response))})
        .catch(error => { console.log('Delete reagents', error.message) 
            alert('Reagent could not be deleted\nError: '+ error.message)})
        
}

export const removeTestType = (testType) => ({    
    type: ActionTypes.REMOVE_TESTTYPE,
    payload: testType
});

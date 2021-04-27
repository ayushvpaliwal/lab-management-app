import React, { Component } from 'react';
import AccountDetails from './AccountDetails'
import Sidebar from './Sidebar.js';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Login } from './Login';
import Admin from './Admin';
import TestHistoryNEW from './TestHistoryNEW';
import InventoryNEW from './InventoryNEW';
import AssayTypes from './AssayTypes';
import { connect } from 'react-redux';
import { checkJWTToken, loginUser, logoutUser, 
    fetchUsers, postUser, putUser,
    fetchReagents, postReagent, putReagent, deleteReagent, fetchDeletedReagents,
    fetchSecReagents, fetchDeletedSecReagents, putSecReagent, deleteSecReagent, 
    deleteTest, fetchTests, putTest, 
    fetchTestTypes, postTestType, deleteTestType} from '../redux/ActionCreators.js'


const mapStateToProps = state => {
    return {
        reagents: state.reagents,
        deletedReagents: state.deleteReagents,
        secReagents: state.secReagents,
        deletedSecReagents: state.deletedSecReagents,
        tests: state.tests,
        testTypes: state.testTypes,
        users: state.users,
        auth: state.auth
    }     
}

const mapDispatchToProps = (dispatch) => ({   
    checkJWTToken: () => dispatch(checkJWTToken()), 
    loginUser: (creds) => dispatch(loginUser(creds)),
    logoutUser: () => dispatch(logoutUser()), 
    fetchUsers: () => dispatch(fetchUsers()), 
    postUser: (user) => dispatch(postUser(user)), 
    putUser: (user, setpassword) => dispatch(putUser(user, setpassword)), 
    putReagent: (reagent, action) => {dispatch(putReagent(reagent, action))},
    deleteReagent: (reagent_id) => {dispatch(deleteReagent(reagent_id))},
    postReagent: (
        unit,
        reagentName,
        supplier,
        lotNr,
        catNr,
        expiryDate,
        dateReceived,
        storageLocation
        ) => dispatch(postReagent(unit, reagentName, supplier, lotNr, catNr, expiryDate, dateReceived, storageLocation)),    
    fetchReagents: () => {dispatch(fetchReagents())},
    fetchDeletedReagents: () => {dispatch(fetchDeletedReagents())},
    fetchSecReagents: () => {dispatch(fetchSecReagents())},
    fetchDeletedSecReagents: () => {dispatch(fetchDeletedSecReagents())},
    putSecReagent: (secReagent, action) => {dispatch(putSecReagent(secReagent, action))},
    deleteSecReagent: (secReagent_id) => {dispatch(deleteSecReagent(secReagent_id))},
    fetchTests: () => {dispatch(fetchTests())},
    putTest: (updatedTest) => {dispatch(putTest(updatedTest))},
    deleteTest: (test_id) => {dispatch(deleteTest(test_id))},
    fetchTestTypes: () => {dispatch(fetchTestTypes())},
    postTestType: (newTestType) => {dispatch(postTestType(newTestType))},
    deleteTestType: (testType_id) => {dispatch(deleteTestType(testType_id))},
});

class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.fetchUsers();
            this.props.fetchReagents();
            this.props.fetchDeletedReagents();
            this.props.fetchSecReagents();
            this.props.fetchDeletedSecReagents();
            this.props.fetchTests();
            this.props.fetchTestTypes();
            this.props.checkJWTToken();
            //alert(JSON.stringify(this.props.auth.user))
        } 
        //alert("Mounted")
        
    }

    render() {
        const InventoryPage = () => {
            return(
                <InventoryNEW
                    auth={this.props.auth} 
                    logoutUser={this.props.logoutUser}
                    // Primary Reagents
                    reagents={this.props.reagents.reagents}
                    deletedReagents={this.props.reagents.deletedReagents}
                    fetchReagents={this.props.fetchReagents} 
                    reagentsErrMess={this.props.reagents.errMess}
                    reagentsLoading={this.props.reagents.isLoading}
                    postReagent={this.props.postReagent}
                    deleteReagent={this.props.deleteReagent} 
                    putReagent={this.props.putReagent}
                    // Secondary Reagents
                    secReagents={this.props.secReagents.secReagents} 
                    deletedSecReagents={this.props.secReagents.deletedSecReagents}
                    fetchSecReagents={this.props.fetchSecReagents}
                    secReagentsErrMess={this.props.secReagents.errMess}
                    secReagentsLoading={this.props.secReagents.isLoading}
                    deleteSecReagent={this.props.deleteSecReagent} 
                    putSecReagent={this.props.putSecReagent}
                    />
            );
        }

        const TestHistoryPage = () => {
            return(
                <TestHistoryNEW 
                    auth={this.props.auth}
                    logoutUser={this.props.logoutUser}
                    tests={() => this.props.tests.tests.filter(entry => entry.status != "DELETED")}
                    deletedTests={() => this.props.tests.tests.filter(entry => entry.status == "DELETED")}
                    myTests={() => (this.props.tests.tests.filter(entry => entry.conductedByUsername == this.props.auth.user.username && entry.status != "DELETED"))} 
                    myDeletedTests={() => (this.props.tests.tests.filter(entry => entry.conductedByUsername == this.props.auth.user.username && entry.status != "DELETED"))} 
                    testsErrMess={this.props.tests.errMess} 
                    testsLoading={this.props.tests.isLoading}
                    fetchTests={this.props.fetchTests}
                    putTest={this.props.putTest}
                    deleteTest={this.props.deleteTest} />
            );
        }

        const AssayTypesPage = () => {
            return(
                <AssayTypes testTypes={this.props.testTypes.testTypes} 
                    testTypesErrMess={this.props.testTypes.errMess} 
                    postTestType={this.props.postTestType}
                    deleteTestType={this.props.deleteTestType}
                    logoutUser={this.props.logoutUser}/>
            );
        }

        const AdminPage = () => {
            return(
                <Admin users={this.props.users.users} 
                    putUser={this.props.putUser}
                    postUser={this.props.postUser}
                    fetchUsers={this.props.testTypes.errMess} 
                    usersErrMess={this.props.usersErrMess}
                    logoutUser={this.props.logoutUser}/>
            );
        }


        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
              this.props.auth.isAuthenticated
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                  }} />
            )} />
        );

        const ProtectedRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
              this.props.auth.isAuthenticated && JSON.parse(localStorage.getItem('userData')).supervisor
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                  }} />
            )} />
        );

        const AdminRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
              this.props.auth.isAuthenticated && JSON.parse(localStorage.getItem('userData')).admin
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                  }} />
            )} />
        );

        return(
                <>
                <Switch>
                    <Route path="/login" 
                        component={() => 
                            (<Login 
                                auth={this.props.auth} 
                                checkJWTToken = {this.props.checkJWTToken}
                                loginUser={this.props.loginUser} 
                                logoutUser={this.props.logoutUser}
                                fetchUsers={this.props.fetchUsers}
                                fetchReagents={this.props.fetchReagents}
                                fetchDeletedReagents={this.props.fetchDeletedReagents}
                                fetchSecReagents={this.props.fetchSecReagents}
                                fetchDeletedSecReagents={this.props.fetchDeletedSecReagents}
                                fetchTests={this.props.fetchTests}
                                fetchTestTypes={this.props.fetchTestTypes}/>)}/>
                    {/*<Route path="/inventory" component={InventoryPage}/>*/}
                    <PrivateRoute exact path="/inventory/primary-reagents/overview" component={InventoryPage}/>
                    <PrivateRoute exact path="/inventory/primary-reagents/recent" component={InventoryPage}/>
                    <PrivateRoute exact path="/inventory/primary-reagents/deleted" component={InventoryPage}/>
                    <PrivateRoute exact path="/inventory/secondary-reagents/overview" component={InventoryPage}/>
                    <PrivateRoute exact path="/inventory/secondary-reagents/recent" component={InventoryPage}/>
                    <PrivateRoute exact path="/inventory/secondary-reagents/deleted" component={InventoryPage}/>
                    <PrivateRoute exact path="/testhistory/all-tests/overview" component={TestHistoryPage}/>
                    <PrivateRoute exact path="/testhistory/all-tests/recent" component={TestHistoryPage}/>
                    <PrivateRoute exact path="/testhistory/all-tests/deleted" component={TestHistoryPage}/>
                    <PrivateRoute exact path="/testhistory/my-tests/overview" component={TestHistoryPage}/>
                    <PrivateRoute exact path="/testhistory/my-tests/recent" component={TestHistoryPage}/>
                    <PrivateRoute exact path="/testhistory/my-tests/deleted" component={TestHistoryPage}/>
                    <ProtectedRoute exact path="/assays" component={AssayTypesPage}/>
                    <PrivateRoute exact path="/account" component={() => <AccountDetails 
                                                                            auth={this.props.auth} 
                                                                            logoutUser={this.props.logoutUser}
                                                                            putUser={this.props.putUser}/>}/>
                    <AdminRoute exact path="/admin" component={AdminPage}/> 
                    <Redirect to="/inventory/primary-reagents/overview" />
                </Switch>
                </>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
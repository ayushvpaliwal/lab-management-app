import React, { createRef, Component } from 'react';
import AddUser from './AddUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import ResetPassword from './ResetPassword';
import Switch from "react-switch";

class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: this.props.users,
            usersRenderList: localStorage.getItem("showDeletedUsers") == "true" ? (this.props.users.filter(user => user.status != "ACTIVE")) : 
                        (this.props.users.filter(user => user.status == "ACTIVE")),
            isAddUserModalOpen: false,
            isPasswordModalOpen: false,  
            selectedUser: null,
            deactivated: localStorage.getItem("showDeletedUsers") == "false" ? false : true
        }
    }

    showDeleted = () => {
        if (this.state.deactivated) {
            localStorage.setItem("showDeletedUsers", false);
            this.setState({
                usersRenderList: this.props.users.filter(user => user.status == "ACTIVE"),
                deactivated: false
            })
        }
        else {
            localStorage.setItem("showDeletedUsers", true);
            this.setState({
                usersRenderList: this.props.users.filter(user => user.status != "ACTIVE"),
                deactivated: true
            })
        }
    }

    handleChange = (e) => {
        var usersCopy = this.state.users.slice();
        
        if (this.state.deactivated) {
            this.setState({
                usersRenderList: usersCopy.filter(user => user.username.includes(e.target.value) && user.status!="ACTIVE")
            })
        }
        else {
            this.setState({
                usersRenderList: usersCopy.filter(user => user.username.includes(e.target.value) && user.status=="ACTIVE")
            })
        }
    }

    changeUserRole = (user, e) => {
        
        var updatedUser = {
            _id: user._id,
            supervisor:  e.target.value=="Supervisor User" ? true : false,
        }
        this.props.putUser(updatedUser);
    }

    deleteUser = (user) => {
        var updatedUser = {
            _id: user._id,
            status:  "DELETED"
        }
        this.props.putUser(updatedUser);
    }

    reActivateUser = (user) => {
        var updatedUser = {
            _id: user._id,
            status:  "ACTIVE"
        }
        this.props.putUser(updatedUser);
    }

    handleAddUserModalShow = () => {
        this.setState({
            isAddUserModalOpen: true
        });
    }

    handleAddUserModalClose = () => {
        this.setState({
            isAddUserModalOpen: false
        });
    }

    handlePasswordModalShow = (user) => {
        this.setState({
            isPasswordModalOpen: true,
            selectedUser: user
        });
    }

    handlePasswordModalClose = () => {
        this.setState({
            isPasswordModalOpen: false
        });
    }

    render() {
        if (this.props.users.isLoading) {
            <div className="row flex-fill h-100 d-flex">
                <div className="col">
                    <div style={{"z-index":"10", "position":"fixed", "border-bottom":"1px solid #E2E2E4", "background-color": "white", "margin-top": "0px", "padding": "10px", "width":"110%"}} className="row header">
                        <div className="col ml-2">
                            <a href="/" onClick={this.props.logoutUser}>
                            <FontAwesomeIcon style={{"verticalAlign":"middle"}} icon={faSignOutAlt} size='lg' rotation={180}/>
                            <span style={{"verticalAlign":"middle"}} className="menu-header"> Sign Out </span>
                            </a>
                        </div>
                    </div>
                    <div style={{"border-right":"1px solid #E2E2E4", "paddingTop":"81px", "paddingLeft":"10px"}} className="row">
                        Loading
                    </div>
                </div>
            </div>
        }
        return (
            <div id="page-wrap" className="container-fluid">         
                <div className="row flex-fill h-100 d-flex">
                    <div className="col">
                        <div style={{"z-index":"10", "position":"fixed", "border-bottom":"1px solid #E2E2E4", "background-color": "white", "margin-top": "0px", "padding": "10px", "width":"110%"}} className="row header">
                            <div className="col my-auto ml-2">
                                <a href="/" onClick={this.props.logoutUser}>
                                <FontAwesomeIcon style={{"verticalAlign":"middle"}} icon={faSignOutAlt} size='lg' rotation={180}/>
                                <span style={{"verticalAlign":"middle"}} className="menu-header"> Sign Out </span>
                                </a>
                            </div>
                        </div>
                        <div style={{"border-right":"1px solid #E2E2E4", "paddingTop":"81px", "paddingLeft":"10px"}} className="row">
                            <div className="col-lg-8 col-xl-6 ml-2">
                                <div className="container-fluid">
                                    <div className="row">
                                        <span style={{"color":"#432F87", "fontSize":"20px"}}>User Management</span>
                                        <span><FontAwesomeIcon style={{"marginLeft":"30px"}} icon={faSearch} size='sm'/><input style={{"border":"1px solid lightgrey", "borderRadius":"4px", "marginLeft":"5px", "marginRight":"10px"}} type="text" onChange={(e => this.handleChange(e))}/></span>
                                        <span><Switch checkedIcon={null} uncheckedIcon={null} offColor="#66CDAA" onColor="#888" onChange={this.showDeleted} checked={this.state.deactivated} /></span>
                                        <span className="ml-auto"><a style={{"color":"#432F87"}} type="button" onClick={this.handleAddUserModalShow}><FontAwesomeIcon icon={faPlus} size='sm'/> <span className="d-none d-sm-inline">Add New User</span></a></span>
                                    </div>
                                    <div className="row">
                                        <ul style={{"width":"100%"}} className="list-unstyled">
                                            {this.state.usersRenderList.map(user => {
                                                if (user.username != JSON.parse(localStorage.getItem('userData')).username) {
                                                    return(
                                                        <li key={user._id}>
                                                            {
                                                                user.status!="DELETED" ? (
                                                                    <div style={{"border":"1px solid lightgrey", "padding":"20px", "borderRadius":"7px", "backgroundColor":"white", "boxShadow":"0px 0px 3px 0px lightgrey"}} key={user._id} className="user-card">
                                                                        <span>{user.username}</span>
                                                                        <span className="float-right">
                                                                            {
                                                                                !user.admin ? (
                                                                                    <select style={{"borderRadius":"3px", "height":"27px"}} onChange={(e) => this.changeUserRole(user, e)}>
                                                                                        <option selected={user.supervisor && !user.admin ? ("selected") : ""}>Supervisor User</option>
                                                                                        <option selected={!user.supervisor && !user.admin ? ("selected") : ""}>Regular User</option>
                                                                                    </select>
                                                                                ) : (
                                                                                    <span>Admin</span>
                                                                                )
                                                                            }
                                                                        </span>
                                                                        <span style={{"float":"right", "height":"27px","border":"1px solid #432F87", "backgroundColor":"#432F87", "color":"white", "borderRadius":"3px", "padding":"0px 5px 0px 5px", "margin-left":"10px", "margin-right":"10px"}}>
                                                                            <a onClick={() => this.handlePasswordModalShow(user)} type="button">Reset Password</a>
                                                                        </span>
                                                                        <span style={{"float":"right", "height":"27px", "borderRadius":"3px", "color":"#432F87", "padding":"0px 3px 0px 3px", "margin-left":"10px", "margin-right":"10px"}}>
                                                                            <a onClick={() => this.deleteUser(user)} type="button"><FontAwesomeIcon style={{"verticalAlign":"middle"}} icon={faTrash} size='lg'/></a>
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <div style={{"border":"1px solid lightgrey", "padding":"20px", "borderRadius":"7px", "backgroundColor":"#E2E2E4", "boxShadow":"0px 0px 3px 0px lightgrey"}} key={user._id} className="user-card">
                                                                        <span>{user.username}</span>
                                                                        <span style={{"float":"right", "height":"27px","border":"1px solid grey", "backgroundColor":"grey", "color":"lightgrey", "borderRadius":"3px", "padding":"0px 3px 0px 3px", "margin-left":"10px", "margin-right":"10px"}}>
                                                                            <a type="button">Reset Password</a>
                                                                        </span>
                                                                        <span style={{"float":"right", "height":"27px","border":"1px solid #432F87", "borderRadius":"3px", "backgroundColor":"#432F87", "color":"white", "padding":"0px 3px 0px 3px", "margin-left":"10px", "margin-right":"10px"}}>
                                                                            <a onClick={() => this.reActivateUser(user)} type="button">Reactivate</a>
                                                                        </span>
                                                                    </div>
                                                                )
                                                            }
                                                        </li>
                                                    );
                                                }
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AddUser isModalOpen={this.state.isAddUserModalOpen} handleModalClose={this.handleAddUserModalClose} handleModalShow={this.handleAddUserModalShow} 
                    postUser={this.props.postUser} />
                <ResetPassword isModalOpen={this.state.isPasswordModalOpen} handleModalClose={this.handlePasswordModalClose} handleModalOpen={this.handlePasswordModalShow} 
                    putUser={this.props.putUser} selectedUser={this.state.selectedUser} />
            </div>
        );
    }
}

export default Admin;
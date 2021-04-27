import React, { Component, useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { RiDeleteBin7Fill, RiTimeFill } from 'react-icons/ri'
import { FaLayerGroup } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { PrimaryReagents } from './PrimaryReagentsOverview';
import { PrimaryReagentsRecent } from './PrimaryReagentsRecent';
import { PrimaryReagentsBin } from './PrimaryReagentsBin';
import { SecReagentsOverview } from './SecReagentsOverview';
import { SecReagentsRecent } from './SecReagentsRecent';
import { SecReagentsBin } from './SecReagentsBin';

class InventoryNEW extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPath: '',
            isSidebarOpen: false
        }
    }   

    toggleSidebar = () => {
        this.setState({
            isSidebarOpen: !this.state.isSidebarOpen
        });
    }

    componentDidMount() {
        const currentPath = window.location.pathname.split('/').splice(2,).join('/');
        this.setState({
            currentPath: currentPath
        });
    }

    renderTable(path) {
        switch(path) {
            case 'primary-reagents/overview':
                return(
                    <PrimaryReagents reagents={this.props.reagents} 
                        reagentsErrMess={this.props.reagentsErrMess}
                        reagentsLoading={this.props.reagentsLoading}
                        postReagent={this.props.postReagent}
                        deleteReagent={this.props.deleteReagent} 
                        putReagent={this.props.putReagent} 
                        toggleSidebar={this.toggleSidebar}
                        isSidebarOpen={this.state.isSidebarOpen}/>
                );
            case 'primary-reagents/recent':
                return(
                    <PrimaryReagentsRecent reagents={this.props.reagents} 
                        reagentsErrMess={this.props.reagentsErrMess}
                        reagentsLoading={this.props.reagentsLoading}
                        postReagent={this.props.postReagent}
                        deleteReagent={this.props.deleteReagent} 
                        putReagent={this.props.putReagent}
                        toggleSidebar={this.toggleSidebar}
                        isSidebarOpen={this.state.isSidebarOpen}/>
                );
            case 'primary-reagents/deleted':
                return(
                    <PrimaryReagentsBin 
                        deletedReagents={this.props.deletedReagents}
                        fetchReagents={this.props.fetchReagents} 
                        reagentsErrMess={this.props.reagentsErrMess}
                        postReagent={this.props.postReagent}
                        deleteReagent={this.props.deleteReagent} 
                        putReagent={this.props.putReagent} />
                );
            case 'secondary-reagents/overview':
                return(
                    <SecReagentsOverview secReagents={this.props.secReagents} 
                        secReagentsLoading={this.props.secReagentsLoading}
                        secReagentsErrMess={this.props.errMess}
                        deleteSecReagent={this.props.deleteSecReagent} 
                        putSecReagent={this.props.putSecReagent} />  
                );
            case 'secondary-reagents/recent':
                return(
                    <SecReagentsRecent secReagents={this.props.secReagents} 
                        secReagentsLoading={this.props.secReagentsLoading}
                        secReagentsErrMess={this.props.errMess}
                        deleteSecReagent={this.props.deleteSecReagent} 
                        putSecReagent={this.props.putSecReagent} />  
                );
            
            case 'secondary-reagents/deleted':
                return(
                    <SecReagentsBin 
                        deletedSecReagents={this.props.deletedSecReagents}
                        secReagentsErrMess={this.props.errMess}
                        deleteSecReagent={this.props.deleteSecReagent} 
                        putSecReagent={this.props.putSecReagent} />  
                );
        }
    }

    render() {
        return(
            <div id="page-wrap" className="container-fluid">                
                <a onClick={this.toggleSidebar}><div className={"sidebar-open-"+String(this.state.isSidebarOpen)}></div></a>
                <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} logoutUser={this.props.logoutUser} />                        
                <div className="row min-vh-100">
                    <div style={{"position":"fixed", "zIndex":"7"}} className="col-2 d-flex flex-column h-100">
                        <div className="row header">
                            <div style={{"paddingRight":"0px"}} className="col my-auto ml-5">
                                <span className="menu-header d-none d-xl-inline"> Inventory </span>
                            </div>
                        </div>
                        <div style={{"border-right":"1px solid #E2E2E4", "backgroundColor":"#F6F5FA"}} className="row side-info justify-content-center bg-blue flex-grow-1">
                            <div style={{"margin-top":"15px"}} className="container-fluid side-info-container">
                                <div className="row">
                                    <div style={{"margin-right":"15px", 
                                                    "border-radius": "7px",
                                                    "background-color": "rgba(47, 73, 209, 0.15)",
                                                    "height": "70px",
                                                    "padding-top":"20px",
                                                    "box-shadow": "0px 0px 5px 0px lightgrey",
                                                    "paddingLeft":"0px",
                                                    "paddingRight":"0px"}} 
                                        className="col text-center section-selection">
                                        <a className="switch" 
                                            href={this.state.currentPath.split('/')[0]=='primary-reagents' ? '/inventory/secondary-reagents/overview' : '/inventory/primary-reagents/overview'}>
                                            <span className="dot" style={{"height": "30px",
                                                                        "border": "0.5px solid rgba(229, 229, 229, 1)",
                                                                        "width": "30px",
                                                                        "background-color": "#ffffff",
                                                                        "border-radius": "50%",
                                                                        "display": "inline-block",
                                                                        "box-shadow": "0px 0px 1px 0px #888888"}}>
                                            <HiOutlineSwitchHorizontal/>
                                        </span></a>
                                        <span className="d-none d-lg-inline" style={{"font-weight":"700", "font-size":"large", 
                                            "color": "rgba(237, 139, 0, 0.95)", "padding-left": "10px",
                                            "vertical-align":"middle"}}> 
                                                {this.state.currentPath.split('/')[0]=='primary-reagents' ? 'Primary' : 'Secondary'}
                                            </span>
                                    </div>
                                </div>
                                <div style={{"margin-top":"30px"}} className="row section-choices">
                                    <div className="col text-center text-lg-left" style={{"padding":"0px"}}>
                                        <ul className="list-unstyled">
                                            <li><a type="button"
                                                    href={this.state.currentPath.split('/')[0]=='primary-reagents' ? '/inventory/primary-reagents/overview' : '/inventory/secondary-reagents/overview'}  
                                                    className={this.state.currentPath.split('/')[1]=='overview' ? 'selected' : ''}><span><FaLayerGroup /></span> <span className="d-none d-lg-inline">Overview</span></a></li>
                                            <li><a type="button" 
                                                    href={this.state.currentPath.split('/')[0]=='primary-reagents' ? '/inventory/primary-reagents/recent' : '/inventory/secondary-reagents/recent'} 
                                                    className={this.state.currentPath.split('/')[1]=='recent' ? 'selected' : ''}><span><RiTimeFill /></span> <span className="d-none d-lg-inline">Last Used</span></a></li>
                                            <li><a type="button" 
                                                    href={this.state.currentPath.split('/')[0]=='primary-reagents' ? '/inventory/primary-reagents/deleted' : '/inventory/secondary-reagents/deleted'} 
                                                    className={this.state.currentPath.split('/')[1]=='deleted' ? 'selected' : ''}><span><RiDeleteBin7Fill /></span> <span className="d-none d-lg-inline">Deleted</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div style={{"position":"absolute", "bottom": "10px", "width":"80%"}} className="row">
                                    <div style={{"height": "80px", "border-top":"1px solid rgba(229, 229, 229, 1)", "padding-top":"13px"}} 
                                        className="col text-center">
                                            <div className="row">
                                                <div style={{"paddingLeft":"0px"}} className="col-3">
                                                    <a href="/account" className="dot action-button">
                                                            {JSON.parse(localStorage.getItem('userData')).firstName.substring(0,1)
                                                                        + JSON.parse(localStorage.getItem('userData')).lastName.substring(0,1)}
                                                        </a>
                                                </div>
                                                <div style={{"margin-left":"10px"}} className="col">
                                                    <div className="row">
                                                        <a style={{"color":"black"}} href="/account">
                                                            <span className="d-none d-xl-inline" style={{"display":"block"}}>
                                                                {JSON.parse(localStorage.getItem('userData')).firstName
                                                                    + ' ' + JSON.parse(localStorage.getItem('userData')).lastName}
                                                            </span>
                                                        </a>
                                                    </div>
                                                    <div style={{"color":"gray"}} className="row">
                                                        <span className="d-none d-xl-inline" style={{"display":"block"}}>
                                                            {JSON.parse(localStorage.getItem('userData')).supervisor ? 'Supervisor' : 'Regular'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-10 offset-2">
                        {this.renderTable(this.state.currentPath)}                                                                 
                    </div>
                </div>
            </div>
        );
    }
}

export default InventoryNEW;
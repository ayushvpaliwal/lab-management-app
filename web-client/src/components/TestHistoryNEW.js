import React, { Component, useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import { RiDeleteBin7Fill, RiTimeFill } from 'react-icons/ri'
import { FaLayerGroup } from 'react-icons/fa'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import { AllTestsOverview } from './AllTestsOverview';
import { AllTestsBin } from './AllTestsBin';
import { MyTestsOverview } from './MyTestsOverview';
import { MyTestsBin } from './MyTestsBin';

class TestHistoryNEW extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPath: ''
        }
    }   

    componentDidMount() {
        const currentPath = window.location.pathname.split('/').splice(2,).join('/');
        this.setState({
            currentPath: currentPath
        });
    }

    renderTable(path) {
        switch(path) {
            case 'all-tests/overview':
                return(
                    <AllTestsOverview tests={this.props.tests} 
                        testsLoading={this.props.testsLoading}
                        testsErrMess={this.props.testsErrMess}
                        fetchTests={this.props.fetchTests}
                        putTest={this.props.putTest}
                        deleteTest={this.props.deleteTest} />  
                );
            case 'all-tests/deleted':
                return(
                    <AllTestsBin deletedTests={this.props.deletedTests} 
                        testsLoading={this.props.testsLoading}
                        testsErrMess={this.props.testsErrMess}
                        fetchTests={this.props.fetchTests}
                        putTest={this.props.putTest}
                        deleteTest={this.props.deleteTest} />  
                );
            case 'my-tests/overview':
                return(
                    <MyTestsOverview myTests={this.props.myTests} 
                        testsLoading={this.props.testsLoading}
                        testsErrMess={this.props.testsErrMess}
                        fetchTests={this.props.fetchTests}
                        putTest={this.props.putTest}
                        deleteTest={this.props.deleteTest} />  
                );
            case 'my-tests/deleted':
                return(
                    <MyTestsBin myDeletedTests={this.props.myDeletedTests} 
                        testsLoading={this.props.testsLoading}
                        testsErrMess={this.props.testsErrMess}
                        fetchTests={this.props.fetchTests}
                        putTest={this.props.putTest}
                        deleteTest={this.props.deleteTest} />  
                );
        }
    }

    render() {
        return(
            <div id="page-wrap" className="container-fluid">         
                <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} logoutUser={this.props.logoutUser} />                               
                <div className="row flex-fill h-100 d-flex">
                    <div style={{"position":"fixed"}} className="col-2 d-flex flex-column h-100">
                        <div style={{"border-bottom":"1px solid #E2E2E4", "background-color": "white", "margin-top": "0px", "padding": "10px"}} className="row header">
                            <div style={{"paddingRight":"0px"}} className="col my-auto ml-5">
                                <span className="menu-header d-none d-xl-inline"> Test History </span>
                            </div>
                        </div>
                        <div style={{"border-right":"1px solid #E2E2E4",  "backgroundColor":"#F6F5FA"}} className="row side-info justify-content-center bg-blue flex-grow-1">
                            <div style={{"margin-top":"15px"}} className="container-fluid side-info-container">
                                <div className="row">
                                    <div style={{"margin-right":"15px", 
                                                    "border-radius": "7px",
                                                    "background-color": "rgba(47, 73, 209, 0.15)",
                                                    "box-shadow": "0px 0px 5px 0px lightgrey",
                                                    "height": "70px",
                                                    "padding-top":"20px",
                                                    "paddingLeft":"0px",
                                                    "paddingRight":"0px"}} 
                                        className="col text-center section-selection">
                                        <a className="switch" 
                                            href={this.state.currentPath.split('/')[0]=='all-tests' ? '/testhistory/my-tests/overview' : '/testhistory/all-tests/overview'}>
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
                                            "color": "rgba(237, 139, 0, 0.95)", "padding-left": "15px",
                                            "vertical-align":"middle"}}>{this.state.currentPath.split('/')[0]=='all-tests' ? 'All Tests' : 'My Tests'}</span>
                                    </div>
                                </div>
                                <div style={{"margin-top":"30px"}} className="row section-choices">
                                    <div className="col text-center text-lg-left" style={{"padding":"0px"}}>
                                        <ul className="list-unstyled">
                                            <li><a type="button" 
                                                    href={this.state.currentPath.split('/')[0]=='all-tests' ? '/testhistory/all-tests/overview' : '/testhistory/my-tests/overview'}
                                                    className={this.state.currentPath.split('/')[1]=='overview' ? 'selected' : ''}><span><FaLayerGroup /></span> <span className="d-none d-lg-inline">Overview</span></a></li>
                                            <li><a type="button" 
                                                    href={this.state.currentPath.split('/')[0]=='all-tests' ? '/testhistory/all-tests/deleted' : '/testhistory/my-tests/deleted'}
                                                    className={this.state.currentPath.split('/')[1]=='deleted' ? 'selected' : ''}><span><RiDeleteBin7Fill /></span> <span className="d-none d-lg-inline">Deleted</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div style={{"position":"absolute", "bottom": "10px", "width":"80%"}} className="row">
                                    <div style={{"height": "80px", "border-top":"1px solid rgba(229, 229, 229, 1)", "padding-top":"13px"}} 
                                        className="col text-center">
                                            <div className="row">
                                                <div style={{"paddingLeft":"0px"}} className="col-3">
                                                    <a href="/account" className="dot"
                                                        style={{"line-height":"50px",
                                                        "border": "0.5px solid white",
                                                        "width": "50px",
                                                        "background-color": "white",
                                                        "border-radius": "50%",
                                                        "display": "inline-block",
                                                        "box-shadow": "0px 0px 5px 0px lightgrey",
                                                        "text-align": "center",
                                                        "vertical-align": "middle"}}>
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

export default TestHistoryNEW;
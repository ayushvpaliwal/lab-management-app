import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { ImLab } from "react-icons/im";
import { RiHistoryLine, RiTestTubeLine, RiAccountBoxLine } from "react-icons/ri";
import { MdCreateNewFolder } from "react-icons/md";

function Sidebar(props) {
  return (
    <Menu>
      <a className="menu-item" href="/inventory/primary-reagents/overview">
        <span><RiTestTubeLine/>&nbsp;&nbsp;Inventory</span>
      </a>
      <a className="menu-item" href="/testhistory/all-tests/overview">
      <span><RiHistoryLine/>&nbsp;&nbsp;Test History</span>
      </a>
      {JSON.parse(localStorage.getItem('userData')).supervisor ? 
        <a className="menu-item" href="/assays">
          <span><MdCreateNewFolder/>&nbsp;&nbsp;Assays</span>
        </a> :
        null}
      <a className="menu-item" href="/account">
      <span><RiAccountBoxLine/>&nbsp;&nbsp;Account</span>
      </a>
      <a id="signout-link" className="menu-item" href="/" onClick={props.logoutUser}>
        Sign Out
      </a>
    </Menu>
  );
};

export default Sidebar;
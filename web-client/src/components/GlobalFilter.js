import React from 'react';
import { FaSearch } from 'react-icons/fa'
//import { Button, Form, FormGroup, Label, Input, Col} from 'reactstrap';
import { Button, Form, FormGroup, Label, Input, Col} from 'react-bootstrap';

export const GlobalFilter = ({ filter, setFilter }) => {
    return(
        <>
            <span>
                <FaSearch />
            </span>
            <span>
                <input value={filter || ''} onChange={e => setFilter(e.target.value)} id="searchBar" type="search" name="search" placeholder="Search anything..."/>
            </span>
        </>
    )
}
import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, useRowSelect, useExpanded } from 'react-table';
import { COLUMNS } from './ColumnsTH'
import './table.css';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { GlobalFilter } from './GlobalFilter';
import { Checkbox } from './CheckBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faPencilAlt, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'
import Loader from "react-loader-spinner";

export const AllTestsRecent = (props) => {
    
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => props.tests, [])
    //const [data, setData] = useState(props.tests, []);
    
    const tableInstance = useTable({
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: 'updatedAt',
                        desc: true
                    }
                ],
                groupBy: ['lotNr'],
                hiddenColumns: ['updatedAt']
            },
        },         
        useGlobalFilter,
        useSortBy,
        useExpanded,
        useRowSelect,        
        (hooks) => {
            hooks.visibleColumns.push((columns) => {
                return [                    
                    ...columns,
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <Checkbox {...getToggleAllRowsSelectedProps()} />
                        ),
                        Cell: ({ row }) => (
                            <Checkbox {...row.getToggleRowSelectedProps()}/>
                        )
                    }    
                ]
            })
        })

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        rows, 
        prepareRow,
        state,
        setGlobalFilter,
        selectedFlatRows,
        visibleColumns,
        //state: { expanded },
    } = tableInstance

    const { globalFilter } = state

    const [selectedRow, setSelectRows] = useState('')

    const deleteRows = () => { 
        selectedFlatRows.forEach(row => {
            // const dataCopy = [...data];
            // dataCopy.splice(row.index, 1);            
            //setData(dataCopy)
            //alert(row.original.id)       
            props.deleteTest(row.original._id)
        });
    }

    const switchToMyTests = () => {
        var dataCopy = [...data];
        const userName = 'Alyda Jarnell';
        const myTests = dataCopy.filter(({conductedBy}) => conductedBy === userName);
        //props.switchTests(myTests);
    }

    const switchToAllTests = () => { 
        props.fetchTests();
    }

    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
          <pre
            style={{
              fontSize: '10px',
            }}
          >
            <code>{JSON.stringify({ values: row.original }, null, 2)}</code>
          </pre>
        ),
        []
      )

    if (props.testsLoading) {
        return(
            <>
            <div className="row header table">
                <div className="col-6 col-sm-8 col-lg-6">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                </div>
                <div style={{"padding-right":"20px"}} className="col-2 ml-auto text-right">
                </div>
            </div>
            <div style={{"paddingTop":"61px"}} className="table-container row"> 
                <div style={{"padding-top":"100px", "padding-bottom":"0px", "padding-left":"0px", "padding-right":"10px"}} className="col-11 text-center">
                    <Loader
                        type="TailSpin"
                        color="rgba(67, 47, 135, 0.9)"
                        height={50}
                        width={50}
                        timeout={3000} //3 secs
                    />
                </div>
            </div>
            </>
        );
    }
    else {
        return(
            <>        
            <div className="row header table">
                <div className="col-6 col-sm-8 col-lg-6">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                </div>
                <div style={{"padding-right":"20px"}} className="col-2 ml-auto text-right">
                </div>
            </div>
            <div style={{"paddingTop":"61px"}} className="table-container row"> 
                <div style={{"padding-top":"10px", "padding-bottom":"0px", "padding-left":"0px", "padding-right":"10px"}} className="col-11">
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted ? (column.isSortedDesc ? <AiFillCaretDown/> : <AiFillCaretUp/>) : ''}
                                                </span>
                                            </th>
                                        ))}
                                </tr>
                            ))}                
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row)
                            return (
                            // Use a React.Fragment here so the table markup is still valid
                            <React.Fragment {...row.getRowProps()}>
                                <tr>
                                {row.cells.map(cell => {
                                    return (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    )
                                })}
                                </tr>
                                {/*
                                    If the row is in an expanded state, render a row with a
                                    column that fills the entire length of the table.
                                */}
                                {row.isExpanded ? (
                                <tr>
                                    <td colSpan={visibleColumns.length}>
                                    {/*
                                        Inside it, call our renderRowSubComponent function. In reality,
                                        you could pass whatever you want as props to
                                        a component like this, including the entire
                                        table instance. But for this example, we'll just
                                        pass the row
                                        */}
                                    {renderRowSubComponent({ row })}
                                    </td>
                                </tr>
                                ) : null}
                            </React.Fragment>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="col-1">
                    {selectedFlatRows[0] ? (
                        <div className="row">
                            <div className="col text-center">
                                <ul style={{"position": "fixed", "paddingLeft":"20px"}} className="list-unstyled">
                                    <li>
                                        <a type="button" onClick={deleteRows} className="dot"
                                        style={{"line-height":"40px",
                                        "border": "0.5px solid white",
                                        "width": "50px",
                                        "background-color": "white",
                                        "border-radius": "50%",
                                        "paddingRight":"3px",
                                        "display": "inline-block",
                                        "box-shadow": "0px 0px 5px 0px lightgrey",
                                        "text-align": "center",
                                        "vertical-align": "middle"}}>
                                        <FontAwesomeIcon icon={faTimes} color="grey" size='lg'/></a>
                                    </li>
                                </ul>
                            </div>    
                        </div>
                    ) : null}
                </div>  
            </div>
            
            </>
        );
    }
}


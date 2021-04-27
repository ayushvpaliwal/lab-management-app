import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, useRowSelect, useExpanded, useGroupBy } from 'react-table';
import { COLUMNS } from './ColsPrimaryReagents'
import './table.css';
import { GlobalFilter } from './GlobalFilter';
import AddReagent from './AddReagent';
import PrReagentsCards from './PrReagentsCards';
import { Button }  from "react-bootstrap";
import { Checkbox } from './CheckBox';
import {AiFillCaretDown, AiFillCaretUp, AiOutlineRight, AiOutlineDown, AiFillFolderAdd} from 'react-icons/ai';
import QRCode  from 'qrcode.react';
import html2canvas from 'html2canvas';
import EditReagent from './EditReagent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faPencilAlt, faDownload, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import Loader from "react-loader-spinner";

export const PrimaryReagents = (props) => {
    
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => props.reagents, [])

    //const [data, setData] = useState(props.reagents, []);

    const tableInstance = useTable({
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: 'dateReceived',
                        desc: true
                    }
                ],
                groupBy: ['dateReceived'],
                hiddenColumns: ['updatedAt']
            },
            autoResetExpanded: false,
            autoResetSelectedRows: false,
        },         
        useGlobalFilter,
        useGroupBy,
        useSortBy,
        useExpanded,
        useRowSelect,         
        (hooks) => {
            hooks.visibleColumns.push((columns) => {
                return [                    
                    ...columns,
                    {
                        id: 'selection',
                        groupByBoundary: true,
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            //<Checkbox {...getToggleAllRowsSelectedProps()} />
                            null
                        ),
                        Cell: ({ row }) => (
                            row.subRows.length ? (null) : <Checkbox {...row.getToggleRowSelectedProps()}/>                            
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
        toggleAllRowsExpanded,
        isAllRowsExpanded,   
        toggleRowExpanded
        //state: { groupBy, expanded },
    } = tableInstance

    //useMemo(() => toggleAllRowsExpanded(true), [toggleAllRowsExpanded]);


    const { globalFilter } = state

    const [isSidebarOpen, setSidebarState] = useState(false)
    const [isModalOpen, setModalState] = useState(false)

    const toggleSidebar = (form=null) => {     
        setSidebarState(!isSidebarOpen);
        props.toggleSidebar(true);
    }    

    const handleModalShow = () => {
        setModalState(true);
    }

    const handleModalClose = () => {
        setModalState(false);
    }

    const deleteRows = () => { 
        selectedFlatRows.forEach(row => {  
            if (row.original) {
                var update = {
                    _id: row.original._id,
                    status: "DELETED"
                }
                props.putReagent(update);
            }   
        });
    }

    const disposeReagents = () => { 
        selectedFlatRows.forEach(row => { 
            if (row.original) {    
                var update = {
                    _id: row.original._id,
                    status: "DISPOSED"
                }
                props.putReagent(update, "dispose");
            }
        });
    }

    const downloadQR = () => {

        document.getElementById("hidden-qr").style.display = "block";
        //document.getElementById("hidden-qr").style.marginTop = "1500px";

        selectedFlatRows.forEach(row => {
            if (row.original != null) {
                var elemId = String(row.original._id)+"-ext" 
                var elem = document.getElementById(`${elemId}`)
                elem.style.display = "block";           
                html2canvas(elem).then(function(canvas) {
                    elem.style.display = "none";  
                    const pngUrl = canvas
                        .toDataURL("image/png")
                        .replace("image/png", "image/octet-stream");  
                    let downloadLink = document.createElement("a");
                    downloadLink.href = pngUrl;
                    downloadLink.download = elemId+".png";
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);                                   
                })    
            }            
        });

        document.getElementById("hidden-qr").style.display = "none";
        //document.getElementById("hidden-qr").style.marginTop = "0px";
    }
    
    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
        //   <pre
        //     style={{
        //       fontSize: '10px',
        //     }}
        //   >
        //     <code>{JSON.stringify({ values: row.original }, null, 2)}</code>
        //   </pre>
            <PrReagentsCards reagentValues={row.original} />
        ),
        []
    )

    if (props.reagentsLoading) {
        return (
            <>
            <div className="row header table">
                <div className="col-6 col-sm-8 col-lg-6">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
                </div>
                <div className="col ml-auto text-right">
                    <span>
                        <a style={{"font-size": "medium", "color":"rgba(67, 47, 135, 0.9)"}} type="button" onClick={toggleSidebar}>Add Reagent<span style={{"padding-left":"10px"}}><FontAwesomeIcon icon={faFolderPlus} size='lg' /></span></a>
                    </span>
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
                <div className="col ml-auto text-right">
                    <span>
                        <a style={{"font-size": "medium", "color":"rgba(67, 47, 135, 0.9)"}} type="button" onClick={toggleSidebar}>Add Reagent<span style={{"padding-left":"10px"}}><FontAwesomeIcon icon={faFolderPlus} size='lg' /></span></a>
                    </span>
                </div>
            </div>
            {selectedFlatRows[0] ? (
                <>
                <div className="action-button-row row d-xl-none float-left">
                    <div className="col-2 col-md-1">
                        <a type="button" 
                            style={{"backgroundColor":"rgba(67, 47, 135, 0.9)",
                                "boxShadow":"0px 0px 5px 0px rgba(67, 47, 135, 0.9)"}}  
                            onClick={handleModalShow} className="dot action-button">
                        <FontAwesomeIcon icon={faPencilAlt} color="white" size='lg'/></a>
                    </div>
                    <div className="col-2 col-md-1">
                        <a type="button" onClick={disposeReagents} className="dot action-button">
                        <FontAwesomeIcon icon={faTimes} color="rgba(67, 47, 135, 0.9)" size='lg'/></a>
                    </div>
                    <div className="col-2 col-md-1">
                        <a type="button" onClick={downloadQR} className="dot action-button">
                        <FontAwesomeIcon icon={faDownload} color="rgba(67, 47, 135, 0.9)" size='lg'/></a>
                    </div>
                    <div className="col-2 col-md-1">
                        <a type="button" onClick={deleteRows} className="dot action-button">
                        <FontAwesomeIcon icon={faTrash} color="grey" size='lg'/></a>
                    </div>
                </div>
                <div className="row proxy-row d-xl-none"></div>
                </>
            ) : null}
            <div className="table-container row">  
                <div style={{"padding-top":"10px", "padding-bottom":"0px", "padding-left":"0px", "padding-right":"10px"}} className="col-11">
                    <table {...getTableProps()}>
                        <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} {...column.getHeaderProps()}>
                                {/*column.canGroupBy ? (
                                    <span {...column.getGroupByToggleProps()}>
                                    {column.isGrouped ? <span><AiOutlineUngroup/> </span> : <span><AiOutlineGroup/> </span>}
                                    </span>                                                                
                                ) : null*/}         
                                {column.render('Header')}                            
                                <span>
                                {column.canSort ? (
                                    column.isSorted ? (column.isSortedDesc ? <AiFillCaretDown/> : <AiFillCaretUp/>) : ''
                                ) : null}
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
                            <React.Fragment key={row.getRowProps().key}>                        
                            <tr className={row.subRows.length ? "grouped-row" : ""}> 
                                {row.cells.map(cell => {
                                return (
                                    <td
                                    {...cell.getCellProps()}                                
                                    >
                                    {cell.isGrouped ? (
                                        <>
                                        <span {...row.getToggleRowExpandedProps()}>
                                            {row.isExpanded ? <AiOutlineDown/> : <AiOutlineRight/>}
                                        </span>{' '}
                                        {cell.render('Cell')} {/*({row.subRows.length})*/}
                                        </>
                                    ) : cell.isAggregated ? (
                                        cell.render('Aggregated')
                                    ) : cell.isPlaceholder ? null : (
                                        cell.render('Cell')
                                    )}
                                    </td>
                                )
                                })}
                            </tr>                        
                            {row.isExpanded && !row.subRows.length ? (
                                <tr>
                                    <td colSpan={visibleColumns.length}>
                                    {renderRowSubComponent({ row })}
                                    </td>
                                </tr>
                                ) : null}                        
                            </React.Fragment>                        
                            )                        
                        })}
                        </tbody>
                    </table>
                    <pre>
                        <code>
                            {/*JSON.stringify({
                                selectedFlatRows: selectedFlatRows.map((row) => row.original),
                            },
                            null,
                            2
                        )*/}
                        </code>
                    </pre>
                    <div id="hidden-qr">                    
                        {
                            selectedFlatRows.map(row => {
                                if (row.original == null) {
                                    return null
                                } 
                                else {
                                    return( 
                                        <div style={{display: "none"}} key={row.original._id} id={String(row.original._id)+"-ext"} className="container">
                                            <div className="row">                                            
                                                <h5><b>LOT Number</b>: {row.original.lotNr} {"\n"}</h5>                                                                                                                                                                                            
                                            </div>               
                                            <div className="row">                                    
                                                <QRCode
                                                    id={String(row.original._id)}
                                                    value={String(row.original._id)}
                                                    size={290}
                                                    level={"H"}
                                                    includeMargin={false}
                                                />
                                            </div>              
                                            <div className="row">
                                                <p><b>Unique ID</b>: {row.original._id}</p>{' '}    
                                            </div>                        
                                            <div className="row">
                                                <p><b>Pack No</b>: {row.original.unit}</p>                                                                                                    
                                            </div>                                                                                           
                                        </div>
                                    );
                                }                                        
                            })
                        }
                    </div>
                </div>
                <div className="col-1 text-center button-col d-none d-xl-block">
                    {selectedFlatRows[0] ? (
                        <ul className="list-unstyled">
                            <li>
                                <div>
                                    <a type="button" onClick={handleModalShow} 
                                        style={{"backgroundColor":"rgba(67, 47, 135, 0.9)",
                                            "boxShadow":"0px 0px 5px 0px rgba(67, 47, 135, 0.9)"}}
                                        className="dot action-button">
                                    <FontAwesomeIcon icon={faPencilAlt} color="white" size='lg'/></a>
                                </div>
                                <div className="subtitle">Edit</div>
                            </li>
                            <li>
                                <div>
                                    <a type="button" onClick={disposeReagents} className="dot action-button">
                                    <FontAwesomeIcon icon={faTimes} color="rgba(67, 47, 135, 0.9)" size='lg'/></a>
                                </div>
                                <div className="subtitle">Dispose</div>
                            </li>
                            <li>
                                <div>
                                    <a type="button" onClick={downloadQR} className="dot action-button">
                                    <FontAwesomeIcon icon={faDownload} color="rgba(67, 47, 135, 0.9)" size='lg'/></a>
                                </div>
                                <div className="subtitle">Download QR</div>
                            </li>
                            <li>
                                <div>
                                    <a type="button" onClick={deleteRows} className="dot action-button">
                                    <FontAwesomeIcon icon={faTrash} color="grey" size='lg'/></a>
                                </div>
                                <div className="subtitle">Delete</div>
                            </li>
                        </ul>
                    ) : null}
                </div>
                <AddReagent isSidebarOpen={props.isSidebarOpen} onSidebarToggle={toggleSidebar} 
                    selectedRow={{selectedFlatRows: selectedFlatRows.map((row) => row.original)[0] != null ? 
                        selectedFlatRows.map((row) => row.original)[0] : 
                        selectedFlatRows.map((row) => row.original)[1]}}
                    resetAddReagentForm={props.resetAddReagentForm}
                    changeAddReagentForm={props.changeAddReagentForm} 
                    postReagent={props.postReagent} />        
                <EditReagent isModalOpen={isModalOpen} handleModalClose={handleModalClose} handleModalOpen={handleModalShow} 
                    selectedRow={{selectedFlatRows: selectedFlatRows.map((row) => row.original)[0] != null ? 
                        selectedFlatRows.map((row) => row.original)[0] : 
                        selectedFlatRows.map((row) => row.original)[1]}} 
                        putReagent={props.putReagent} />                                                   
            </div>
            </>
        );
    }
}

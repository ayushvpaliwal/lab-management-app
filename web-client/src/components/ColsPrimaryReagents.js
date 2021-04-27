import { format } from 'date-fns';
import {AiOutlineRight, AiOutlineDown} from 'react-icons/ai'

export const COLUMNS = [
    {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
            row.subRows.length ? null : (
            <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? <AiOutlineDown/> : <AiOutlineRight/>}
            </span>
            )
        )
    },
    {
        Header: 'Date Received',
        id: 'dateReceived',
        accessor: 'dateReceived',
        Cell: ({value}) => (value!=null ? format(new Date(value), 'dd/MM/yyyy'): ''),
        aggregate: topValue,
    },
    {
        Header: 'Reagent Name',
        accessor: 'reagentName',
        canGroupBy: false,
        aggregate: topValue,
        disableSortBy: true
    },
    {
        Header: 'LOT Number',
        id: 'lotNr',
        accessor: 'lotNr',
        canGroupBy: true,
        disableSortBy: true,
        aggregate: topValue,
    },
    {
        Header: 'Unit',
        accessor: 'unit',
        canGroupBy: false,
        aggregate: unitCount,
        disableSortBy: true
    },
    {
        Header: 'Expiry Date',
        accessor: 'expiryDate',
        Cell: ({value}) => (value!=null ? (new Date(value) < new Date() ? 
                                <span style={{"color":"#F08080"}}>{format(new Date(value), 'dd/MM/yyyy')}</span> :
                                <span>{format(new Date(value), 'dd/MM/yyyy')}</span>) : ''),
        aggregate: topValue,
        canGroupBy: false
    },
    {
        Header: 'Status',
        accessor: 'status',
        Cell: ({value}) => {
            switch(value) {
                case "DISPOSED":
                    return <><span style={{"color":"orange"}}>Disposed
                    </span> <span style={{"backgroundColor":"orange", "height":"10px", "width":"10px", "borderRadius":"50%", "display":"inline-block"}}></span></>;
                case "DELETED":
                    return <><span style={{"color":"#F08080"}}>Deleted
                    </span> <span style={{"backgroundColor":"#F08080", "height":"10px", "width":"10px", "borderRadius":"50%", "display":"inline-block"}}></span></>;
                case "OK":
                    return <><span style={{"color":"lightgreen"}}>Ok
                    </span> <span style={{"backgroundColor":"lightgreen", "height":"10px", "width":"10px", "borderRadius":"50%", "display":"inline-block"}}></span></>;
                default:
                    return "";
            }
        },
        canGroupBy: false
    },
    {
        Header: 'Assay',
        accessor: 'assayName',
        canGroupBy: false,
    },
    {
        Header: 'Supplier',
        accessor: 'supplier',
        disableSortBy: true,
        aggregate: topValue,
        canGroupBy: true
    },
    {
        Header: 'CAT Number',
        accessor: 'catNr',
        canGroupBy: false,
        aggregate: topValue
    },
    {
        Header: 'Updated At',
        accessor: 'updatedAt',
    }    
]

const onRowClick = (state, rowInfo, column, instance) => {
    return {
        onClick: e => {
            console.log('A Td Element was clicked!')
            console.log('it produced this event:', e)
            console.log('It was in this column:', column)
            console.log('It was in this row:', rowInfo)
            console.log('It was in this table instance:', instance)
        }
    }
}

function topValue(leafValues) {
    let top = leafValues[0]
    return top
}

function unitCount(leafValues){
    return String(leafValues.length);
}
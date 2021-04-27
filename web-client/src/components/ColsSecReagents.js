import { format } from 'date-fns';
import {AiOutlineRight, AiOutlineDown} from 'react-icons/ai'

export const COLUMNS = [
    {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <AiOutlineDown/> : <AiOutlineRight/>}
          </span>
        ),
    },
    {
        Header: 'Date Created',
        accessor: 'dateCreated',
        Cell: ({value}) => (value!=null ? format(new Date(value), 'dd/MM/yyyy'): '')
    },    
    {
        Header: 'Reagent Name',
        accessor: 'reagentName',
    },
    {
        Header: 'Lot Nr',
        accessor: 'lotNr',
    },
    {
        Header: 'Expiry Date',
        accessor: 'expiryDate',
        Cell: ({value}) => (value!=null ? (new Date(value) < new Date() ? 
                                <span style={{"color":"#F08080"}}>{format(new Date(value), 'dd/MM/yyyy')}</span> :
                                <span>{format(new Date(value), 'dd/MM/yyyy')}</span>) : '')
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
        Header: 'Created By',
        accessor: 'createdBy',
    },
    {
        Header: 'Updated At',
        accessor: 'updatedAt',
    }    
]
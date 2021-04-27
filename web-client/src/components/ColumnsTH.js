import { format } from 'date-fns';
import {AiOutlineRight, AiOutlineDown} from 'react-icons/ai'

export const COLUMNS = [
    {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <AiOutlineDown/> : <AiOutlineRight/>}
          </span>
        ),
    },
    {
        Header: 'Assay Name',
        accessor: 'assayName',
        //canGroupBy: false,
        //aggregate: topValue,
    },
    {
        Header: 'Batch Nr',
        accessor: 'batchNr',
        //canGroupBy: false,
        //aggregate: topValue
    },
    {
        Header: 'Date and Time',
        accessor: 'createdAt',
        Cell: ({value}) => {return format(new Date(value), 'dd/MM/yyyy')}
        //canGroupBy: false,
        //aggregate: topValue,
    },    
    {
        Header: 'Conducted By',
        accessor: 'conductedBy',
        //disableSortBy: true
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
  
    /*
    leafValues.forEach(value => {
      min = Math.min(min, value)
      max = Math.max(max, value)
    })
    */
  
    return top
  }
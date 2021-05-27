import Table from './Table';
//import Col from 'react-bootstrap/Col';
//import Row from 'react-bootstrap/Row';
//import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import ActionsCell from './ActionsCell';
import React, { Component } from 'react';
class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.cellFunction = this.cellFunction.bind(this);
    this.viewEditPictures = this.viewEditPictures.bind(this);
  }

  viewEditPictures(id) {
    alert('Not yet Implemented. ID: ' + id);
  }

  // This is a custom UI for our 'between' or number range
  // filter. It uses two number boxes and filters rows to
  // ones that have values between the two
  NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
  }) {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
      preFilteredRows.forEach((row) => {
        min = Math.min(row.values[id], min);
        max = Math.max(row.values[id], max);
      });
      return [min, max];
    }, [id, preFilteredRows]);

    return (
      <div
        style={{
          display: 'flex',
        }}
      >
        <input
          aria-describedby="inputGroup-sizing-sm"
          value={filterValue[0] || ''}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              val ? parseInt(val, 10) : undefined,
              old[1],
            ]);
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '70px',
            marginRight: '0.5rem',
          }}
        />
        to
        <input
          aria-describedby="inputGroup-sizing-sm"
          value={filterValue[1] || ''}
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            setFilter((old = []) => [
              old[0],
              val ? parseInt(val, 10) : undefined,
            ]);
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '70px',
            marginLeft: '0.5rem',
          }}
        />
      </div>
    );
  }

  // This is a custom filter UI for selecting
  // a unique option from a list
  SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
      <select
        as="select"
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  //returns a custom cell that houses our actions
  cellFunction({ cell }) {
    if (this.props.inventory.length) {
      return (
        <ActionsCell
          cell={cell}
          inventory={this.props.inventory}
          handleDelete={this.props.deleteInventory}
          handleViewEdit={this.props.updateInventory}
          handleViewEditPictures={this.viewEditPictures}
        ></ActionsCell>
      );
    }
  }

  render() {
    let columns = [
      {
        Header: ' ',
        isVisible: false,
        id: 'units',
        hideHeader: false,
        columns: [
          {
            Header: 'Item ID',
            accessor: 'id',
            isVisible: false,
            disableFilters: true,
          },
          {
            Header: 'Name',
            accessor: 'name',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
          },
          {
            Header: 'Location',
            accessor: 'location',
            Filter: this.SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Purchased Amount',
            accessor: 'purchasedAmount',
            Filter: this.NumberRangeColumnFilter,
            filter: 'between',
          },
          {
            Header: 'Purchased Date',
            accessor: 'purchasedDate',
            Filter: this.SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Estimated Value',
            accessor: 'estimatedValue',
            sortDescFirst: true,

            Filter: this.NumberRangeColumnFilter,
            filter: 'between',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            disableFilters: true,
            Cell: this.cellFunction,
          },
        ],
      },
    ];
    return !this.props.inventory.length ? (
      <div>Please Click plus button to add Inventory</div>
    ) : (
      <Table columns={columns} data={this.props.inventory} />
    );
  }
}

export default InventoryList;

InventoryList.propTypes = {
  inventory: PropTypes.array,
  handleSaveInventory: PropTypes.func,
  updateInventory: PropTypes.func,
  deleteInventory: PropTypes.func,
};

import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { DeviceCameraIcon, TrashIcon, NoteIcon } from '@primer/octicons-react';
class ActionsCell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={1}>
            <Button
              variant="link"
              onClick={() =>
                this.props.handleViewEditPictures(this.props.cell.row.values.id)
              }
            >
              <DeviceCameraIcon fill="#000" size={16} />
            </Button>
          </Col>
          <Col xs={1}>
            <Button
              variant="link"
              onClick={() =>
                this.props.handleViewEdit(this.props.cell.row.values.id)
              }
            >
              <NoteIcon fill="#000" size={16} />
            </Button>
          </Col>
          <Col xs={1}>
            <Button
              variant="link"
              onClick={() =>
                this.props.handleDelete(this.props.cell.row.values.id)
              }
            >
              <TrashIcon fill="#000" size={16} />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
ActionsCell.propTypes = {
  inventory: PropTypes.array,
  cell: PropTypes.object,
  handleViewEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleViewEditPictures: PropTypes.func,
};

export default ActionsCell;

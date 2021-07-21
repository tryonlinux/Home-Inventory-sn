import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

const initialState = {
  settingSelected: '',
  addValue: '',
};
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }
  addNewLocation() {
    this.props.addNewLocation(this.state.addValue);
    this.setState({
      addValue: '',
    });
  }
  render() {
    return (
      <div>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="settingSelected">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  as="select"
                  name="settingSelected"
                  htmlSize="5"
                  onChange={this.handleInputChange}
                  value={this.state.settingSelected}
                >
                  <option key={-1}> </option>
                  {this.props.locations.map((row) => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </Form.Control>
                <Button
                  variant="danger"
                  onClick={() =>
                    this.props.deleteLocation(this.state.settingSelected)
                  }
                >
                  Delete Selected Location
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <Form>
              <Form.Group controlId="addValue">
                <Form.Label>Add Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Location"
                  name="addValue"
                  value={this.state.addValue}
                  onChange={this.handleInputChange}
                />
                <Button variant="success" onClick={() => this.addNewLocation()}>
                  Add New Location
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="secondary"
              onClick={() => this.props.toggleSettings()}
            >
              Close Settings
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Settings;
Settings.propTypes = {
  locations: PropTypes.array,
  addNewLocation: PropTypes.func,
  deleteLocation: PropTypes.func,
  toggleSettings: PropTypes.func,
};

import React from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InventoryList from './InventoryList';
import InventoryItem from './InventoryItem';
import JSONToCSVConvertor from '../lib/JSONToCSV';
import { PlusCircleIcon, GearIcon } from '@primer/octicons-react';
import Settings from './Settings';

const initialState = {
  loaded: false,
  addInventory: false,
  editInventory: false,
  editID: '',
  displaySettings: false,
  data: {
    inventory: [],
    locations: [],
  },
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    //test data
    // this.state.data.locations = [
    //   'Master Bedroom',
    //   'Bathroom',
    //   'Kitchen',
    //   'Living Room',
    // ];

    this.configureEditorKit();

    this.saveNote = this.saveNote.bind(this);
    this.saveInventory = this.saveInventory.bind(this);
    this.onCancelAddInventory = this.onCancelAddInventory.bind(this);
    this.addInventory = this.addInventory.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.saveInventory = this.saveInventory.bind(this);
    this.displayEditForm = this.displayEditForm.bind(this);
    this.deleteInventoryItem = this.deleteInventoryItem.bind(this);
    this.onAddInventory = this.onAddInventory.bind(this);
    this.addNewLocation = this.addNewLocation.bind(this);
    this.deleteLocation = this.deleteLocation.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
  }

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      setEditorRawText: (text) => {
        this.setState({ ...initialState });
        let entries = [];
        if (text) {
          try {
            entries = JSON.parse(text);
          } catch (e) {
            // Couldn't parse the content
            this.setState({
              loaded: true,
            });
          }
        }
        if (
          entries.length > 0 &&
          entries[0].data.inventory &&
          entries[0].data.inventory.length > 0
        ) {
          this.setState({
            loaded: true,
            addInventory: false,
            editInventory: false,
            data: {
              inventory: entries[0].data.inventory,
              locations: entries[0].data.locations,
            },
          });
        } else {
          this.setState({
            loaded: true,
            addInventory: false,
            editInventory: false,
          });
        }
      },
      clearUndoHistory: () => {},
      getElementsBySelector: () => [],
      generateCustomPreview: (text) => {
        let entries = [];
        try {
          entries = JSON.parse(text);
        } finally {
          // eslint-disable-next-line no-unsafe-finally
          return {
            html: `<div>${entries[0].data.inventory.length}</div>`,
            plain: `${entries[0].data.inventory.length}`,
          };
        }
      },
    });

    this.editorKit = new EditorKit({
      delegate: delegate,
      mode: 'json',
      supportsFilesafe: false,
    });
  };

  saveNote(entries) {
    this.editorKit.onEditorValueChanged(JSON.stringify(entries));
  }

  onAddInventory = () => {
    this.setState({
      addInventory: true,
      editInventory: false,
    });
  };
  onCancelAddInventory = () => {
    this.setState({
      addInventory: false,
      editInventory: false,
      editID: '',
    });
  };

  saveInventory() {
    this.saveNote([
      {
        data: {
          inventory: this.state.data.inventory,
          locations: this.state.data.locations,
        },
      },
    ]);
  }

  addInventory(
    id,
    name,
    location,
    purchasedAmount,
    purchasedDate,
    estimatedValue,
    notes,
    filesafePictures
  ) {
    let data = this.state.data;
    data.inventory.push({
      id: id,
      name: name,
      location: location,
      purchasedAmount: purchasedAmount,
      purchasedDate: purchasedDate,
      estimatedValue: estimatedValue,
      notes: notes,
      filesafePictures: filesafePictures,
    });
    this.setState({ data, addInventory: false });
    this.saveInventory();
  }
  updateInventory(
    id,
    name,
    location,
    purchasedAmount,
    purchasedDate,
    estimatedValue,
    notes,
    filesafePictures
  ) {
    let data = this.state.data;
    let inventory = data.inventory;
    let index = inventory.findIndex((x) => x.id === id);
    inventory.splice(index, 1);
    inventory.push({
      id,
      name,
      location,
      purchasedAmount,
      purchasedDate,
      estimatedValue,
      notes,
      filesafePictures,
    });
    data.inventory = inventory;
    this.setState({ data, addInventory: false, editInventory: false });
    this.saveInventory();
  }

  displayEditForm(id) {
    this.setState({
      addInventory: false,
      editInventory: true,
      editID: id,
    });
  }

  deleteInventoryItem(id) {
    this.setState(
      (prevState) => {
        let data = { ...prevState.data };
        let index = data.inventory.findIndex((x) => x.id === id);
        let inventory = data.inventory
          .slice(0, index)
          .concat(data.inventory.slice(index + 1));
        data = { ...data, inventory };
        return {
          data,
          addInventory: false,
          editInventory: false,
        };
      },
      () => this.saveInventory()
    );
  }
  addNewLocation(location) {
    if (location === '' || location === undefined) {
      alert('Connect add blank location!');
    } else {
      if (!this.state.data.locations.includes(location)) {
        let newLocations = this.state.data.locations.concat(location);
        let newData = this.state.data;
        newData.locations = newLocations;
        this.setState({ data: newData }, () => {
          this.saveInventory();
        });
      } else {
        alert('Location already exists!');
      }
    }
  }
  deleteLocation(location) {
    let newLocations = this.state.data.locations;
    const index = newLocations.indexOf(location);
    if (index > -1) {
      newLocations.splice(index, 1);
      let newData = this.state.data;
      newData.locations = newLocations;
      this.setState({ data: newData }, () => {
        this.saveInventory();
      });
    } else {
      alert('Error Deleting location!');
    }
  }
  toggleSettings() {
    this.setState({
      displaySettings: !this.state.displaySettings,
    });
  }
  render() {
    return (
      <div className="sn-component">
        <div>
          <div className="sk-panel"></div>
        </div>
        <div id="header">
          <Row>
            <Col>
              <Button onClick={this.onAddInventory} variant="dark">
                <PlusCircleIcon size={16} onClick={this.onAddInventory} />
              </Button>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() =>
                  JSONToCSVConvertor(
                    this.state.data.inventory,
                    'Home Inventory',
                    true
                  )
                }
              >
                Export
              </Button>
            </Col>
            <Col>
              <Button onClick={this.toggleSettings} variant="success">
                <GearIcon size={16} />
              </Button>
            </Col>
          </Row>
        </div>
        <div id="content">
          {this.state.displaySettings ? (
            <Settings
              addNewLocation={this.addNewLocation}
              deleteLocation={this.deleteLocation}
              locations={this.state.data.locations}
              toggleSettings={this.toggleSettings}
            />
          ) : this.state.loaded ? (
            this.state.addInventory ? (
              <InventoryItem
                locations={this.state.data.locations}
                onCancelAddInventory={this.onCancelAddInventory}
                handleSubmit={this.addInventory}
                editMode={false}
              />
            ) : this.state.editInventory ? (
              <InventoryItem
                locations={this.state.data.locations}
                onCancelAddInventory={this.onCancelAddInventory}
                handleSubmit={this.updateInventory}
                editMode={true}
                editID={this.state.editID}
                inventory={this.state.data.inventory}
              />
            ) : (
              <InventoryList
                inventory={this.state.data.inventory}
                deleteInventory={this.deleteInventoryItem}
                handleSaveInventory={this.saveInventory}
                updateInventory={this.displayEditForm}
              />
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    );
  }
}

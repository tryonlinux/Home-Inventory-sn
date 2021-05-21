import React from 'react';
import { EditorKit, EditorKitDelegate } from 'sn-editor-kit';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InventoryList from './InventoryList';
import InventoryItem from './InventoryItem';
import JSONToCSVConvertor from '../lib/JSONToCSV';
import { PlusCircleIcon } from '@primer/octicons-react';

const initialState = {
  loaded: false,
  parseError: false,
  addInventory: false,
  editInventory: false,
  editID: '',
  data: {
    inventory: [],
    locations: [],
  },
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.data.locations = [
      'Master Bedroom',
      'Bathroom',
      'Kitchen',
      'Living Room',
    ];

    this.configureEditorKit();

    this.saveNote = this.saveNote.bind(this);
    this.saveInventory = this.saveInventory.bind(this);
    this.onCancelAddInventory = this.onCancelAddInventory.bind(this);
    this.addInventory = this.addInventory.bind(this);
    this.updateInventory = this.updateInventory.bind(this);
    this.saveInventory = this.saveInventory.bind(this);
    this.displayEditForm = this.displayEditForm.bind(this);
    //TODO add form for adding new locations
    //TODO Fix it not properly loading when switching between notes'
  }

  configureEditorKit = () => {
    let delegate = new EditorKitDelegate({
      setEditorRawText: (text) => {
        let parseError = false;
        let entries = [];
        if (text) {
          try {
            entries = JSON.parse(text);
          } catch (e) {
            // Couldn't parse the content
            parseError = true;
            this.setState({
              parseError: true,
            });
          }
        }
        if (
          entries.length > 0 &&
          entries[0].data.inventory &&
          entries[0].data.inventory.length > 0
        ) {
          this.setState(
            {
              loaded: true,
              addInventory: false,
              editInventory: false,
              //  text,
              data: {
                inventory: entries[0].data.inventory,
                locations: entries[0].data.locations,
              },
              // entries,
            },
            () => {
              console.log(JSON.stringify(this.state));
            }
          );
        } else {
          alert('Empty');
          this.setState(
            {
              // text,
              // entries,
              addInventory: false,
              editInventory: false,
            },
            () => {
              console.log(JSON.stringify(this.state));
            }
          );
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
      note: notes,
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

  render() {
    alert(this.state.loaded);
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
          </Row>
        </div>
        <div id="content">
          {this.state.loaded ? (
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

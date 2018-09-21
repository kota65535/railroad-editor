import * as React from "react";
import {FormControlLabel} from '@material-ui/core';
import Checkbox from "@material-ui/core/Checkbox";
import {Tools} from "constants/tools";
import {RailItemData} from "components/rails/index";
import {FormDialog, FormDialogProps, FormDialogState} from "components/common/FormDialog/FormDialog";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import AutoFocusTextValidator from "components/common/AutoFocusTextValidator";

export interface CustomStraightRailDialogProps extends FormDialogProps {
  addUserRail: (item: RailItemData) => void
  definedItems: PaletteItem[]
}

export interface CustomStraightRailDialogState extends FormDialogState {
  isDouble: boolean
}



export default class CustomStraightRailDialog extends FormDialog<CustomStraightRailDialogProps, CustomStraightRailDialogState> {

  constructor(props: CustomStraightRailDialogProps) {
    super(props)
    this.state = this.getInitialState()

    this.onDoubleChange = this.onDoubleChange.bind(this)
  }

  getInitialState = () => {
    return {
      inputs: {},
      isDouble: false,
      disabled: true,
    }
  }

  componentWillMount() {
    ValidatorForm.addValidationRule('isUniqueName', (value) => {
      return ! this.props.definedItems.map(i => i.name).includes(value);
    });
  }

  onOK = (e) => {
    const {isDouble, inputs} = this.state
    let type = isDouble ? 'DoubleStraightRail' : 'StraightRail'
    this.props.addUserRail({
      type: type,
      length: Number(inputs.length),
      name: inputs.name,
      paletteName: Tools.STRAIGHT_RAILS,
    })

    this.onClose()
  }


  onDoubleChange = (e: React.SyntheticEvent<HTMLInputElement|any>) => {
    this.setState({
      isDouble: ! this.state.isDouble,
    });
  };

  renderContent = () => {
    return (
        <ValidatorForm
          ref={(form) => this._form = form}
        >
          <AutoFocusTextValidator
            autoFocus
            label="Length"
            type="number"
            name="length"
            key="length"
            value={this.state.inputs.length}
            onChange={this.onChange('length')}
            onKeyPress={this.onKeyPress}
            validatorListener={this.handleValidation}
            validators={['required']}
            errorMessages={['this field is required']}
          />
          <br/>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.isDouble}
                onChange={this.onDoubleChange}
              />
            }
            label={"Double"}
          />
          <br/>
          <TextValidator
            label="Name"
            name="name"
            key="name"
            value={this.state.inputs.name}
            onChange={this.onChange('name')}
            onKeyPress={this.onKeyPress}
            validatorListener={this.handleValidation}
            validators={['required', 'isUniqueName']}
            errorMessages={['this field is required', 'The name already exists.']}
          />
        </ValidatorForm>
    )
  }
}
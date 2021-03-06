import * as React from 'react'
import AutoFocusTextValidator from "containers/common/AutoFocusTextValidator";
import {FormDialogBase, FormDialogProps, FormDialogState} from "containers/common/FormDialog/FormDialogBase";
import {ValidatorForm} from 'react-material-ui-form-validator';
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {SwitcherType} from "stores/layoutStore";


export interface NewSwitcherDialogProps extends FormDialogProps {
  addSwitcher: (name: string, type: SwitcherType) => void
}


export default class NewSwitcherDialog extends FormDialogBase<NewSwitcherDialogProps, FormDialogState> {

  constructor(props: NewSwitcherDialogProps) {
    super(props)
    this.state = this.getInitialState()
    this.state.inputs.type = SwitcherType.NORMAL
  }

  getInitialState = () => {
    return {
      inputs: this.props.defaultInputs || {},
      disabled: false
    }
  }

  onOK = (e) => {
    const {name, type} = this.state.inputs
    this.props.addSwitcher(name, type as any)
    this.onClose()
  }

  renderContent = () => {
    return (
      <>
        <ValidatorForm
          ref={this.getFormRef}
        >
          <AutoFocusTextValidator
            label="Switcher Name"
            name="name"
            key="name"
            value={this.state.inputs.name}
            onChange={this.onChange('name')}
            onKeyPress={this.onKeyPress}
            validatorListener={this.handleValidation}
            validators={['required']}
            errorMessages={['this field is required']}
            withRequiredValidator={true}
          />
        </ValidatorForm>
        <form>
          <FormControl style={{width: '100%'}}>
            <InputLabel>Switcher Type</InputLabel>
            <Select
              value={this.state.inputs.type}
              onChange={this.onChange('type')}
              autoWidth
              displayEmpty
            >
              <MenuItem value={SwitcherType.NORMAL}>
                {SwitcherType.NORMAL}
              </MenuItem>
              <MenuItem value={SwitcherType.THREE_WAY}>
                {SwitcherType.THREE_WAY}
              </MenuItem>
            </Select>
          </FormControl>
        </form>
      </>
    )
  }
}


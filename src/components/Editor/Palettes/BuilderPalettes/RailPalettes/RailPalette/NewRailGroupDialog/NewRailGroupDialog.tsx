import * as React from 'react'
import getLogger from "logging";
import AutoFocusTextValidator from "components/common/AutoFocusTextValidator";
import {FormDialog, FormDialogProps, FormDialogState} from "components/common/FormDialog/FormDialog";
import {ValidatorForm} from 'react-material-ui-form-validator';
import {compose} from "recompose";
import {withSnackbar} from 'material-ui-snackbar-provider'

const LOGGER = getLogger(__filename)

export interface NewRailGroupDialogProps extends FormDialogProps {
  addUserRailGroup: (name: string, shouldDelete: boolean) => void
  definedItems: PaletteItem[]
  snackbar: any
}


export class NewRailGroupDialog extends FormDialog<NewRailGroupDialogProps, FormDialogState> {

  constructor(props: NewRailGroupDialogProps) {
    super(props)
    this.state = this.getInitialState()
  }

  componentWillMount() {
    ValidatorForm.addValidationRule('isUniqueName', (value) => {
      return ! this.props.definedItems.map(i => i.name).includes(value);
    });
    ValidatorForm.addValidationRule('isNameNotAllowed', (value) => {
      if (value) {
        return value.toUpperCase() !== 'CLIPBOARD'
      } else {
        return true
      }
    });
  }

  onOK = (e) => {
    this.props.addUserRailGroup(this.state.inputs.name, false)
    this.props.snackbar.showMessage(`Copied to "${this.state.inputs.name}" rail group.`)  //`
    this.onClose()
  }

  renderContent = () => {
    console.log(this.state.inputs)
    return (
      <ValidatorForm
        ref={(form) => this._form = form}
      >
        <AutoFocusTextValidator
          label="Rail Group Name"
          name="name"
          key="name"
          value={this.state.inputs.name}
          onChange={this.onChange('name')}
          onKeyPress={this.onKeyPress}
          validatorListener={this.handleValidation}
          validators={['required', 'isUniqueName', 'isNameNotAllowed']}
          errorMessages={['this field is required', 'The name already exists.', 'The name cannot be used.']}
          withRequiredValidator={true}
        />
      </ValidatorForm>
    )
  }
}


export default compose<NewRailGroupDialogProps, NewRailGroupDialogProps | any>(
  withSnackbar()
)(NewRailGroupDialog)

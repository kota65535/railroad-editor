import * as React from 'react'
import * as md5 from "js-md5";
import moment from "moment";
import {default as AutoFocusTextValidator} from "containers/common/AutoFocusTextValidator";
import {FormDialogBase, FormDialogProps, FormDialogState} from "containers/common/FormDialog/FormDialogBase";
import {ValidatorForm} from 'react-material-ui-form-validator';
import {LayoutConfig, LayoutMeta} from "stores/layoutStore";
import * as uuidv4 from "uuid/v4";


export interface SaveLayoutDialogProps extends FormDialogProps {
  onOK: (meta: LayoutMeta) => void
  layoutMeta?: LayoutMeta
  layoutConfig: LayoutConfig
  authData: any
}

export interface SaveLayoutDialogState extends FormDialogState {
}


export default class SaveLayoutDialog extends FormDialogBase<SaveLayoutDialogProps, SaveLayoutDialogState> {

  constructor(props: SaveLayoutDialogProps) {
    super(props)
    this.state = this.getInitialState()

    this.onOK = this.onOK.bind(this)
  }

  getInitialState = () => {
    return {
      ...super.getInitialState(),
      pickerOpen: false,
      pickerAnchor: null,
    }
  }

  onOK = (e) => {
    const meta = this.createLayoutMeta()
    this.props.onOK(meta)
    this.onClose()
  }

  createLayoutId = () => {
    const time = new Date().getTime()
    const userId = this.props.authData.id
    return md5(`${userId}.${time}`)
  }

  createLayoutMeta = () => {
    let layoutId
    if (this.props.layoutMeta) {
      layoutId = this.props.layoutMeta.id
    } else {
      layoutId = uuidv4()
    }
    const timestamp = moment().valueOf()
    const meta = {
      id: layoutId,
      name: this.state.inputs.name,
      lastModified: timestamp
    }
    return meta
  }


  renderContent = () => {
    return (
      <ValidatorForm
        ref={this.getFormRef}
      >
        <AutoFocusTextValidator
          label="Layout Name"
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
    )
  }
}

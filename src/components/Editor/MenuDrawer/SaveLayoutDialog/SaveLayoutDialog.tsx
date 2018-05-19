import * as React from 'react'
import * as md5 from "js-md5";
import StorageAPI from "apis/storage"
import getLogger from "logging";
import * as moment from "moment";
import {default as AutoFocusTextValidator} from "components/common/AutoFocusTextValidator";
import {FormDialog, FormDialogProps, FormDialogState} from "components/common/FormDialog/FormDialog";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import {LayoutConfig, LayoutMeta} from "store/layoutStore";

const LOGGER = getLogger(__filename)

export interface SaveLayoutDialogProps extends FormDialogProps {
  layoutMeta?: LayoutMeta
  layoutConfig: LayoutConfig
  authData: any
  saveLayout: () => void
  setLayoutMeta: (meta: LayoutMeta) => void
}

export interface SaveLayoutDialogState extends FormDialogState {
}


export default class SaveLayoutDialog extends FormDialog<SaveLayoutDialogProps, SaveLayoutDialogState> {

  constructor(props: SaveLayoutDialogProps) {
    super(props)
    this.state = this.getInitialState()

    this.onOK = this.onOK.bind(this)
  }

  getInitialState = () => {
    return {
      inputs: {},
      disabled: true,
      pickerOpen: false,
      pickerAnchor: null,
    }
  }

  onOK = (e) => {
    const meta = this.setLayoutMeta()
    this.saveLayout(meta)
    this.onClose()
  }

  createLayoutId = () => {
    const time = new Date().getTime()
    const userId = this.props.authData.username
    return md5(`${userId}.${time}`)
  }

  setLayoutMeta = () => {
    let layoutId
    if (this.props.layoutMeta) {
      layoutId = this.props.layoutMeta.id
    } else {
      layoutId = this.createLayoutId()
    }
    const timestamp = moment().valueOf()
    const meta = {
      id: layoutId,
      name: this.state.inputs.name,
      lastModified: timestamp
    }
    this.props.setLayoutMeta(meta)
    return meta
  }

  saveLayout = async (meta) => {
    this.props.saveLayout()
    await StorageAPI.saveCurrentLayoutImage(this.props.authData.username, meta.id)
    if (this.props.layoutConfig.backgroundImageUrl) {
      StorageAPI.saveBackgroundImage(this.props.authData.username, meta.id, this.props.layoutConfig.backgroundImageUrl)
    }
  }


  renderContent = () => {
    return (
      <ValidatorForm
        ref={(form) => this._form = form}
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
        />
      </ValidatorForm>
    )
  }
}

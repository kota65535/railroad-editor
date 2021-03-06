import * as React from 'react'
import getLogger from "logging";
import {LayoutConfig, LayoutMeta} from "stores/layoutStore";
import {ValidatorForm} from 'react-material-ui-form-validator';
import {FormDialogBase, FormDialogProps, FormDialogState} from "containers/common/FormDialog/FormDialogBase";


const LOGGER = getLogger(__filename)

export interface SettingsDialogProps extends FormDialogProps {
  config: LayoutConfig
  setConfig: (config: LayoutConfig) => void
  userInfo: any
  layoutMeta: LayoutMeta
}


export class SimulatorSettingsDialog extends FormDialogBase<SettingsDialogProps, FormDialogState> {

  constructor(props: SettingsDialogProps) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      inputs: _.mapValues(this.props.config, (v) => String(v)),
      disabled: true
    }
  }

  onOK = () => {
    // 設定値が全て文字列で入ってくるので、数値に変換を試みる
    const newConfig = _.mapValues(this.state.inputs, value => {
      const numVal = Number(value)
      return numVal ? numVal : value
    })

    LOGGER.info(newConfig)
    this.props.setConfig(newConfig as any)
    this.onClose()
  }


  renderContent = () => {
    return (
      <>
        <ValidatorForm
          ref={this.getFormRef}
        >
          {/*<TextValidator*/}
          {/*label="Paper Width"*/}
          {/*type="number"*/}
          {/*name="paperWidth"*/}
          {/*key="paperWidth"*/}
          {/*value={this.state.inputs.paperWidth}*/}
          {/*onChange={this.onChange('paperWidth')}*/}
          {/*onKeyPress={this.onKeyPress}*/}
          {/*validatorListener={this.handleValidation}*/}
          {/*validators={['required']}*/}
          {/*errorMessages={['this field is required']}*/}
          {/*/>*/}
          {/*<TextValidator*/}
          {/*label="Paper Height"*/}
          {/*type="number"*/}
          {/*name="paperHeight"*/}
          {/*key="paperHeight"*/}
          {/*value={this.state.inputs.paperHeight}*/}
          {/*onChange={this.onChange('paperHeight')}*/}
          {/*onKeyPress={this.onKeyPress}*/}
          {/*validatorListener={this.handleValidation}*/}
          {/*validators={['required']}*/}
          {/*errorMessages={['this field is required']}*/}
          {/*/>*/}
          {/*<TextValidator*/}
          {/*label="Grid Size"*/}
          {/*type="number"*/}
          {/*name="gridSize"*/}
          {/*key="gridSize"*/}
          {/*value={this.state.inputs.gridSize}*/}
          {/*onChange={this.onChange('gridSize')}*/}
          {/*onKeyPress={this.onKeyPress}*/}
          {/*validatorListener={this.handleValidation}*/}
          {/*validators={['required']}*/}
          {/*errorMessages={['this field is required']}*/}
          {/*/>*/}
        </ValidatorForm>
      </>
    )
  }
}

import * as React from "react";
import AutoFocusTextValidator from "containers/common/AutoFocusTextValidator";
import {
  FormDialogBase,
  FormDialogProps,
  FormDialogState,
  FormInputs
} from "containers/common/FormDialog/FormDialogBase";
import {ValidatorForm} from 'react-material-ui-form-validator';
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {LayoutStore, PowerPackData} from "store/layoutStore";
import {inject, observer} from "mobx-react";
import {STORE_LAYOUT, STORE_LAYOUT_LOGIC} from "constants/stores";
import {LayoutLogicStore} from "store/layoutLogicStore";
import {FeederInfo} from "react-rail-components";


export interface FeederSettingDialogProps extends FormDialogProps {
  feeder: FeederInfo
  powerPacks: PowerPackData[]
  layout?: LayoutStore
  layoutLogic?: LayoutLogicStore
}

export interface FeederSettingDialogState extends FormDialogState {
  connectedPowerPackId: number
}


@inject(STORE_LAYOUT, STORE_LAYOUT_LOGIC)
@observer
export default class FeederSettingDialog extends FormDialogBase<FeederSettingDialogProps, FeederSettingDialogState> {

  anchorEl: any

  constructor(props: FeederSettingDialogProps) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialInputs(): FormInputs {
    return _.mapValues(this.props.feeder, (v) => String(v))
  }

  getInitialState = () => {
    const {feeder, powerPacks} = this.props
    const connectedPowerPack = powerPacks.find(p => p.supplyingFeederIds.includes(feeder.id))
    const connectedPowerPackId = connectedPowerPack ? connectedPowerPack.id : null
    return {
      ...super.getInitialState(),
      connectedPowerPackId: connectedPowerPackId,
    }
  }

  onOK = (e) => {
    this.props.layout.updateFeeder({
      ...this.props.feeder,
      name: this.state.inputs.name,
    })
    if (this.state.connectedPowerPackId) {
      this.props.layoutLogic.connectFeederToPowerPack(this.props.feeder.id, this.state.connectedPowerPackId)
    } else {
      this.props.layoutLogic.disconnectFeederFromPowerPack(this.props.feeder.id)
    }
    this.onClose()
  }

  onChangeFeederPowerPack = (e) => {
    // currentTarget は使ってはいけない
    const powerPackId = e.target.value ? Number(e.target.value) : null
    this.setState({
      connectedPowerPackId: powerPackId
    })
  }


  renderContent = () => {
    const {feeder, powerPacks} = this.props

    return (
      <>
        <ValidatorForm
          ref={this.getFormRef}
        >
          <AutoFocusTextValidator
            label="Feeder Name"
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
            <InputLabel>PowerPack</InputLabel>
            <Select
              value={this.state.connectedPowerPackId}
              onChange={this.onChangeFeederPowerPack}
              autoWidth
              displayEmpty
            >
              <MenuItem value={null}>
              </MenuItem>
              {
                powerPacks.map(p => {
                  return (
                    <MenuItem value={p.id}>
                      {p.name}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </form>
      </>
    )
  }
}
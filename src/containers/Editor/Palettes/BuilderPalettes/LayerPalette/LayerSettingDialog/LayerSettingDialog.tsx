import * as React from "react";
import AutoFocusTextValidator from "containers/common/AutoFocusTextValidator";
import ChromePicker from "react-color/lib/components/chrome/Chrome";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {SmallButton, Spacer} from "containers/Editor/Palettes/BuilderPalettes/LayerPalette/LayerSettingDialog/styles";
import {
  FormDialogBase,
  FormDialogProps,
  FormDialogState,
  FormInputs
} from "containers/common/FormDialog/FormDialogBase";
import {ValidatorForm} from 'react-material-ui-form-validator';
import {LayerData} from "stores/layoutStore";


export interface LayerSettingDialogProps extends FormDialogProps {
  layer: LayerData
  addLayer?: (item: LayerData) => void
  updateLayer?: (item: Partial<LayerData>) => void
}

export interface LayerSettingDialogState extends FormDialogState {
  pickerOpen: boolean
  pickerAnchor: HTMLElement
}


export default class LayerSettingDialog extends FormDialogBase<LayerSettingDialogProps, LayerSettingDialogState> {

  anchorEl: any

  constructor(props: LayerSettingDialogProps) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialInputs(): FormInputs {
    return _.mapValues(this.props.layer, (v) => String(v))
  }

  getInitialState = () => {
    return {
      ...super.getInitialState(),
      pickerOpen: false,
      pickerAnchor: null,
    }
  }

  onOK = (e) => {
    if (this.props.addLayer) {
      this.props.addLayer({
          id: 0,
          name: this.state.inputs.name,
          color: this.state.inputs.color,
          visible: true,
          opacity: 1
        }
      )
    }
    if (this.props.updateLayer) {
      this.props.updateLayer({
        ...this.props.layer,
        name: this.state.inputs.name,
        color: this.state.inputs.color,
      })
    }
    this.onClose()
  }

  openColorPicker = (e) => {
    this.setState({
      pickerOpen: true
    })
  }

  onColorChange = (color) => {
    this.setState({
      inputs: {
        ...this.state.inputs,
        color: color.hex
      }
    })
  }

  closeColorPicker = (e) => {
    this.setState({
      pickerOpen: false
    })
  }

  renderContent = () => {
    return (
      <>
        <ValidatorForm
          ref={this.getFormRef}
        >
          <AutoFocusTextValidator
            label="Layer Name"
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
        <Spacer/>

        {/* Rail color */}
        <Grid container justify="center" alignItems="center" spacing={0}>
          <Grid item xs={6}>
            <Typography align="center" variant="body2">
              Rail Color
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <SmallButton
              onClick={this.openColorPicker}
              buttonRef={ref => this.anchorEl = ref}
              style={{backgroundColor: this.state.inputs.color}}
            />
          </Grid>
        </Grid>
        {/* Color picker */}
        <Popover
          open={this.state.pickerOpen}
          onClose={this.closeColorPicker}
          anchorEl={this.anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <ChromePicker
            color={this.state.inputs.color}
            onChangeComplete={this.onColorChange}
          />
        </Popover>
      </>
    )
  }
}

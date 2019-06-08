import * as React from 'react'
import getLogger from "logging";
import {FormDialog, FormDialogProps, FormDialogState} from "components/common/FormDialog/FormDialog";
import "react-fine-uploader/gallery/gallery.css";
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {compose} from "recompose";
import {inject, observer} from "mobx-react";
import {STORE_BUILDER, STORE_LAYOUT} from "../../../../../constants/stores";
import {LayoutStore} from "../../../../../store/layoutStore";
import Typography from "@material-ui/core/Typography";
import {EvenGrid, OddGrid, Spacer} from "./SummaryDialog.style";
import {BuilderStore} from "../../../../../store/builderStore";
import {Tools} from "../../../../../constants/tools";

const LOGGER = getLogger(__filename)

const styles = theme => ({
  grid: {
    paddingTop: '8px',
    paddingBottom: '8px',
    width: '500px'
  },
  type: {
    minWidth: '160px'
  },
  title: {},
  comment: {}
});

export interface ShowSummaryDialogProps extends FormDialogProps {
  builder?: BuilderStore
  layout?: LayoutStore
  classes: any
  snackbar: any
}


@inject(STORE_LAYOUT, STORE_BUILDER)
@observer
export class SummaryDialog extends FormDialog<ShowSummaryDialogProps, FormDialogState> {

  constructor(props: ShowSummaryDialogProps) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      inputs: {},
      disabled: false
    }
  }

  onOK = async () => {
    this.onClose()
  }

  renderRailList = (name: string) => {
    let items = this.props.builder.presetRailPaletteItems[name]
    let customItems = this.props.builder.userRails.filter(c => c.paletteName === name)
    items.concat(customItems)
    let nRows = 0
    let rows = items
      .map(item => {
        let num = this.props.layout.currentLayoutData.rails.filter(r => r.name === item.name).length
        if (num === 0) {
          return null
        }
        let Component = nRows % 2 === 0 ? EvenGrid : OddGrid
        nRows += 1

        return (
          <>
            <Component item xs={6}>
              <Typography>
                {item.name}
              </Typography>
            </Component>
            <Component item xs={6}>
              <Typography>
                {num}
              </Typography>
            </Component>
          </>
        )
      })
      .filter(r => r)

    if (rows.length === 0) {
      return null
    }

    return (
      <Grid container spacing={8} className={this.props.classes.grid}>
        <OddGrid item xs={12}>
          <Typography>{name}</Typography>
        </OddGrid>
        {rows}
      </Grid>
    )
  }

  renderContent = () => {
    return (
      <>
        {this.renderRailList(Tools.STRAIGHT_RAILS)}
        <Spacer/>
        {this.renderRailList(Tools.CURVE_RAILS)}
        <Spacer/>
        {this.renderRailList(Tools.TURNOUTS)}
        <Spacer/>
        {this.renderRailList(Tools.SPECIAL_RAILS)}
      </>
    )
  }
}

export default compose<ShowSummaryDialogProps, ShowSummaryDialogProps | any>(
  withStyles(styles),
)(SummaryDialog)
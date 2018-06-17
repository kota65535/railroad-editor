import * as React from "react";
import {Layer} from "react-paper-bindings";
import getLogger from "logging";
import {WithBuilderPublicProps} from "components/hoc/withBuilder";
import {compose} from "recompose";
import {STORE_BUILDER, STORE_COMMON, STORE_LAYOUT} from "constants/stores";
import {inject, observer} from "mobx-react";
import {LayoutStore, SwitcherData} from "store/layoutStore";
import {CommonStore} from "store/commonStore";
import {Point} from "paper";
import {StyledTooltip} from "components/Editor/LayoutTips/FeederTips/FeederTip/FeederTip.style";
import TurnoutSettingDialog
  from "components/Editor/LayoutTips/RailTips/RailTip/TurnoutSettingDialog/TurnoutSettingDialog";
import {RailData} from "components/rails";
import {normAngle} from "components/rails/utils";

const LOGGER = getLogger(__filename)


export interface FeederTipProps {
  rail: RailData
  switchers: SwitcherData[]
  position: Point
  open: boolean
  layout?: LayoutStore
  common?: CommonStore
}

export interface FeederTipState {
  dialogOpen: boolean
}


@inject(STORE_BUILDER, STORE_LAYOUT, STORE_COMMON)
@observer
export class RailTip extends React.Component<FeederTipProps & WithBuilderPublicProps, FeederTipState> {

  constructor(props: FeederTipProps & WithBuilderPublicProps) {
    super(props)
    this.state = {
      dialogOpen: false
    }
  }

  onClick = (e) => {
    this.setState({
      dialogOpen: true
    })
  }

  onCloseDialog = () => {
    this.setState({
      dialogOpen: false
    })
  }

  getPlacement = () => {
    const a = normAngle(this.props.rail.angle)
    if (0 <= a && a < 22.5) {
      return 'bottom'
    } else if (22.5 <= a && a < 67.5) {
      return 'bottom-end'
    } else if (67.5 <= a && a < 112.5) {
      return 'right'
    } else if (112.5 <= a && a < 157.5) {
      return 'top-end'
    } else if (157.5 <= a && a < 202.5) {
      return 'top'
    } else if (202.5 <= a && a < 247.5) {
      return 'top-start'
    } else if (247.5 <= a && a < 292.5) {
      return 'left'
    } else if (292.5 <= a && a <= 337.5) {
      return 'bottom-start'
    } else {
      return 'bottom'
    }
  }


  render() {
    const {rail, switchers, open, position} = this.props
    const placement = this.getPlacement()

    return (
      <>
        <StyledTooltip open={open} title={rail.name}
                       PopperProps={{onClick: this.onClick, style: {cursor: 'pointer', zIndex: '1000'}}}
                       placement={placement}
        >
          <div style={{top: `${position.y}px`, left: `${position.x}px`, width: '5px', height: '5px', position: 'absolute'}}/>
        </StyledTooltip>
        <TurnoutSettingDialog
          title={'Turnout Setting'}
          open={this.state.dialogOpen}
          onClose={this.onCloseDialog}
          rail={rail}
          switchers={switchers}
        />
      </>
    )
  }
}


export default compose<FeederTipProps, FeederTipProps>(
)(RailTip)
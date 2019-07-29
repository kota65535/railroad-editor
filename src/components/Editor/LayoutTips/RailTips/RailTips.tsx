import * as React from "react";
import {getRailComponent} from "components/rails/utils";
import getLogger from "logging";
import {compose} from "recompose";
import {STORE_BUILDER, STORE_COMMON, STORE_LAYOUT, STORE_PAPER} from "constants/stores";
import {inject, observer} from "mobx-react";
import {LayoutStore} from "store/layoutStore";
import {CommonStore} from "store/commonStore";
import {reaction} from "mobx";
import {RailComponentClasses} from "components/rails";
import RailTip from "components/Editor/LayoutTips/RailTips/RailTip/RailTip";
import {PaperStore} from "../../../../store/paperStore.";

const LOGGER = getLogger(__filename)


export interface RailTipProps {
  layout?: LayoutStore
  common?: CommonStore
  paper?: PaperStore
}

export interface RailTipsState {
  shouldConnect: boolean
}


@inject(STORE_BUILDER, STORE_LAYOUT, STORE_COMMON, STORE_PAPER)
@observer
export class RailTips extends React.Component<RailTipProps, RailTipsState> {

  constructor(props: RailTipProps) {
    super(props)

    reaction(() => this.props.common.zooming,
      () => this.forceUpdate())
  }


  render() {

    const turnoutRails = this.props.layout.currentLayoutData.rails
      .filter(rail => RailComponentClasses[rail.type].defaultProps.numConductionStates > 1)

    return (
      <>
        {
          turnoutRails.map(rail => {
            const c = getRailComponent(rail.id)
            const tipPos = c.railPart.getPivotPositionToParent(c.railPart.tip)
            const position = this.props.paper.scope.view.projectToView(tipPos)
            const switcher = this.props.layout.getSwitcherByRailId(rail.id)
            const color = switcher ? switcher.color : null
            return (
              <RailTip
                open={true}
                position={position}
                rail={rail}
                color={color}
                switchers={this.props.layout.currentLayoutData.switchers}
              />
            )
          })
        }
      </>
    )
  }
}


export default compose<RailTipProps, RailTipProps | any>(
)(RailTips)

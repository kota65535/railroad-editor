import * as React from "react";
import ArcPart, {ArcDirection} from "./primitives/ArcPart";
import {CURVED_TURNOUT_ANGLE_DEVIATION, RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/rails/parts/primitives/PartBase";
import RailPartBase, {RailPartBaseDefaultProps, RailPartBaseProps} from "components/rails/parts/RailPartBase";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

interface CurvedTurnoutRailPartProps extends RailPartBaseProps {
  innerRadius: number
  outerRadius: number
  innerCenterAngle: number
  outerCenterAngle: number
  direction: ArcDirection
}


export default class CurvedTurnoutRailPart extends RailPartBase<CurvedTurnoutRailPartProps, {}> {
  public static defaultProps: RailPartBaseDefaultProps = RailPartBase.defaultProps


  constructor(props: CurvedTurnoutRailPartProps) {
    super(props)
  }

  get joints() {
    return [
      [
        {pivotPartIndex: 0, pivot: Pivot.LEFT},
        {pivotPartIndex: 0, pivot: Pivot.RIGHT},
        {pivotPartIndex: 1, pivot: Pivot.RIGHT}
      ],
      [
        {pivotPartIndex: 1, pivot: Pivot.LEFT},
        {pivotPartIndex: 0, pivot: Pivot.RIGHT},
        {pivotPartIndex: 1, pivot: Pivot.RIGHT}
      ]
    ][this.props.conductionState]
  }

  get feederSockets() {
    return []
  }

  get conductiveParts() {
    return [[0], [1]][this.props.conductionState]
  }

  renderParts = () => {
    const {innerRadius, outerRadius, innerCenterAngle, outerCenterAngle, direction, fillColor, flowDirections} = this.props

    return (
      <>
        <ArcPart
          direction={direction}
          radius={outerRadius}
          centerAngle={outerCenterAngle}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
          fillColor={fillColor}
          flowDirection={flowDirections[0]}
          data={{
            type: 'Part'
          }}
        />
        <ArcPart
          angle={direction === ArcDirection.RIGHT ? CURVED_TURNOUT_ANGLE_DEVIATION : -CURVED_TURNOUT_ANGLE_DEVIATION}
          direction={direction}
          radius={innerRadius}
          centerAngle={innerCenterAngle}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
          fillColor={fillColor}
          flowDirection={flowDirections[1]}
          data={{
            type: 'Part'
          }}
        />
      </>
    )
  }
}

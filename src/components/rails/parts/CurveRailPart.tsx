import * as React from "react";
import ArcPart, {ArcDirection} from "./primitives/ArcPart";
import {RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/rails/parts/primitives/PartBase";
import RailPartBase, {RailPartBaseDefaultProps, RailPartBaseProps} from "components/rails/parts/RailPartBase";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

interface CurveRailPartProps extends RailPartBaseProps {
  radius: number
  centerAngle: number
  direction: ArcDirection
}


export default class CurveRailPart extends RailPartBase<CurveRailPartProps, {}> {
  public static defaultProps: RailPartBaseDefaultProps = RailPartBase.defaultProps

  constructor(props: CurveRailPartProps) {
    super(props)
  }

  get joints() {
    return [
      {pivotPartIndex: 0, pivot: Pivot.LEFT},
      {pivotPartIndex: 0, pivot: Pivot.RIGHT},
    ]
  }

  get feederSockets() {
    return [
      {pivotPartIndex: 0, pivot: Pivot.CENTER},
    ]
  }

  get conductiveParts() {
    return [0]
  }


  renderParts = () => {
    const {radius, centerAngle, direction, fillColor, flowDirections} = this.props

    return (
      <>
        <ArcPart
          pivot={Pivot.LEFT}
          direction={direction}
          radius={radius}
          centerAngle={centerAngle}
          width={RAIL_PART_WIDTH}
          fillColor={fillColor}
          flowDirection={flowDirections[0]}
          data={{
            type: 'Part'
          }}
        />
      </>
    )
  }
}

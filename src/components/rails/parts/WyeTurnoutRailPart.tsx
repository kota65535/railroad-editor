import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "./primitives/RectPart";
import ArcPart, {ArcDirection} from "./primitives/ArcPart";
import {RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/rails/parts/primitives/PartBase";
import PartGroup from "components/rails/parts/primitives/PartGroup";
import RailPartBase, {RailPartBaseDefaultProps, RailPartBaseProps} from "components/rails/parts/RailPartBase";
import getLogger from "logging";

const LOGGER = getLogger(__filename)


interface WyeTurnoutRailPartProps extends RailPartBaseProps {
  radius: number
  centerAngle: number
}


export default class WyeTurnoutRailPart extends RailPartBase<WyeTurnoutRailPartProps, {}> {
  public static defaultProps: RailPartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivotJointIndex: 0,
    detectionEnabled: false,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  pivots = [
    {pivotPartIndex: 0, pivot: Pivot.LEFT},
    {pivotPartIndex: 0, pivot: Pivot.RIGHT},
    {pivotPartIndex: 1, pivot: Pivot.RIGHT}
  ]

  angles = [
    () => this.props.angle,
    () => this.props.angle - this.props.centerAngle - 180,
    () => this.props.angle + this.props.centerAngle - 180,
  ]

  constructor(props: WyeTurnoutRailPartProps) {
    super(props)
  }

  getPivot(jointIndex: number) {
    return this.pivots[jointIndex]
  }

  getAngle(jointIndex: number) {
    return this.angles[jointIndex]()
  }

  render() {
    const { radius, centerAngle, pivotJointIndex, data } = this.props
    const {pivotPartIndex, pivot} = this.getPivot(pivotJointIndex)

    const part = (
      <PartGroup
        pivotPartIndex={pivotPartIndex}
        pivot={pivot}
        data={data}
      >
        <ArcPart
          direction={ArcDirection.LEFT}
          radius={radius}
          centerAngle={centerAngle}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
          data={{
            type: 'Part'
          }}
        />
        <ArcPart
          direction={ArcDirection.RIGHT}
          radius={radius}
          centerAngle={centerAngle}
          width={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
          data={{
            type: 'Part'
          }}
        />
      </PartGroup>
    )

    return this.createComponent(part, part)
  }
}

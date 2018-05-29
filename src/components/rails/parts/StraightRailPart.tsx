import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "./primitives/RectPart";
import {RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {default as PartBase, Pivot} from "components/rails/parts/primitives/PartBase";
import PartGroup from "components/rails/parts/primitives/PartGroup";
import RailPartBase, {RailPartBaseDefaultProps, RailPartBaseProps} from "components/rails/parts/RailPartBase";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

interface StraightRailPartProps extends RailPartBaseProps {
  length: number
}


export default class StraightRailPart extends RailPartBase<StraightRailPartProps, {}> {
  public static defaultProps: RailPartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    detectionEnabled: false,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  constructor(props: StraightRailPartProps) {
    super(props)

    this.parts = new Array(1)
  }

  // Pivotにするジョイントの位置を指定するための情報
  get pivots() {
    return [
      {pivotPartIndex: 0, pivot: Pivot.LEFT},
      {pivotPartIndex: 0, pivot: Pivot.RIGHT}
    ]
  }

  // Pivotジョイントに応じて変わるレールの角度
  get angles() {
    return [
      this.props.angle,
      this.props.angle + 180
    ]
  }

  renderParts = () => {
    const { length, pivotJointIndex, data } = this.props
    const {pivotPartIndex, pivot} = this.getPivot(pivotJointIndex)
    return (
      <PartGroup
        pivotPartIndex={pivotPartIndex}
        pivot={Pivot.LEFT}
        data={data}
      >
        <RectPart
          width={length}
          height={RAIL_PART_WIDTH}
          pivot={Pivot.LEFT}
          data={{
            type: 'Part'
          }}
        />
      </PartGroup>
    )
  }
}

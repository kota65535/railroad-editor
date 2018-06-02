import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import DetectablePart from "./primitives/DetectablePart";
import CirclePart from "./primitives/CirclePart";
import {Pivot} from "components/rails/parts/primitives/PartBase";
import {
  FEEDER_SOCKET_DETECTION_OPACITY_RATE,
  FEEDER_SOCKET_FILL_COLORS,
  FEEDER_SOCKET_HEIGHT,
  FEEDER_SOCKET_HIT_RADIUS,
  FEEDER_SOCKET_WIDTH
} from "constants/parts";
import RectPart from "components/rails/parts/primitives/RectPart";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

interface FeederSocketProps extends Partial<DefaultProps> {
  name?: string
  data?: any
  onMouseMove?: (e: MouseEvent) => void
  onLeftClick?: (e: MouseEvent) => boolean
  onRightClick?: (e: MouseEvent) => boolean
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
}

interface DefaultProps {
  position?: Point
  angle?: number
  pivot?: Pivot
  selected?: boolean
  opacity?: number
  visible?: boolean
  fillColors?: string[]
  hasFeeder?: boolean
  detectionEnabled?: boolean
}


export default class FeederSocket extends React.Component<FeederSocketProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    selected: false,
    opacity: 1,
    visible: true,
    fillColors: FEEDER_SOCKET_FILL_COLORS,
    hasFeeder: false,
    detectionEnabled: true
  }

  part: DetectablePart

  constructor(props: FeederSocketProps) {
    super(props)
  }

  // ========== Public APIs ==========

  get position() {
    return this.part.position
  }

  get globalPosition() {
    return this.part.globalPosition
  }

  get angle() {
    return this.part.angle
  }

  get globalAngle() {
    return this.part.globalAngle
  }


  // ========== Private methods ==========

  render() {
    const {
      position, angle, detectionEnabled, hasFeeder, pivot, selected, fillColors, opacity, visible,
      name, data, onLeftClick, onRightClick, onMouseMove, onMouseEnter, onMouseLeave
    } = this.props

    return (
      <DetectablePart
        mainPart={
          <RectPart
            width={FEEDER_SOCKET_WIDTH}
            height={FEEDER_SOCKET_HEIGHT}
            opacity={opacity}
          />
        }
        detectionPart={
          <CirclePart
            radius={FEEDER_SOCKET_HIT_RADIUS}
            opacity={opacity * FEEDER_SOCKET_DETECTION_OPACITY_RATE}
          />
        }
        position={position}
        angle={angle}
        pivot={pivot}
        fillColors={fillColors}
        visible={visible}
        detectionEnabled={detectionEnabled && !hasFeeder}
        name={name}
        data={data}
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        ref={(part) => {if (part) this.part = part}}
      />
    )
  }
}
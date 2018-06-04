import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import {Pivot} from "components/rails/parts/primitives/PartBase";
import {GAP_JOINER_HEIGHT, GAP_JOINER_SOCKET_FILL_COLORS, GAP_JOINER_WIDTH} from "constants/parts";
import RectPart from "components/rails/parts/primitives/RectPart";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

interface GapJoinerProps extends Partial<DefaultProps> {
  onLeftClick?: (e: MouseEvent) => boolean
}

interface DefaultProps {
  position?: Point
  angle?: number
  pivot?: Pivot
  selected?: boolean
  opacity?: number
  visible?: boolean
  fillColor?: string
}


export default class GapJoiner extends React.Component<GapJoinerProps, {}> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    selected: false,
    opacity: 1,
    visible: true,
    fillColor: GAP_JOINER_SOCKET_FILL_COLORS[0],
  }


  constructor(props: GapJoinerProps) {
    super(props)
  }

  render() {
    const { position, angle, pivot, selected, fillColor, opacity, visible, onLeftClick } = this.props

    return (
      <RectPart
        position={position}
        angle={angle}
        width={GAP_JOINER_WIDTH}
        height={GAP_JOINER_HEIGHT}
        fillColor={fillColor}
        opacity={opacity}
        pivot={Pivot.CENTER}
        visible={visible}
        selected={selected}
        onClick={onLeftClick}
      />
    )
  }
}


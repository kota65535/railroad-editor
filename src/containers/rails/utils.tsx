import * as React from "react";
import RailContainers, {RailComponentClasses, RailData, RailGroupData} from "containers/rails/index";
import getLogger from "logging";
import {FeederInfo, GapJoinerInfo, RailBase, RailBaseProps} from "react-rail-components/lib/RailBase";
import {Point} from "paper";
import {LayerData} from "stores/layoutStore";
import {RailGroup} from "react-rail-components";
import * as _ from 'lodash';
import 'lodash.combinations';
import 'lodash.product';
import {CLOSED_JOINT_ANGLE_TORELANCE, CLOSED_JOINT_DISTANCE_TORELANCE,} from "constants/tools";
import {WithRailBaseProps} from "./withRailBase";
import Feeder from "react-rail-components/lib/parts/Feeder";
import {FEEDER_SOCKET_FILL_COLORS} from "react-rail-components/lib/constants";
import {JointPair} from "useCases";

const LOGGER = getLogger(__filename)


export const createFeederComponent = (feeder: FeederInfo) => {
  const rail = getRailComponent(feeder.railId)
  const pivotInfo = {pivotPartIndex: feeder.socketId, pivot: feeder.pivot}
  return (
    <Feeder
      {...feeder}
      position={rail.railPart.getPivotPositionToParent(pivotInfo)}
      angle={rail.railPart.getPivotAngleToParent(pivotInfo)}
      fillColor={FEEDER_SOCKET_FILL_COLORS[2]}
      opacity={0.8}
    />
  )
}


export const createRailOrRailGroupComponent = (railGroup: RailGroupData, rails: RailData[], layer: LayerData) => {
  if (railGroup) {
    return createRailGroupComponent(railGroup, rails, layer)
  } else {
    return (
      <>
        {rails.map(r => createRailComponent(r, layer))}
      </>
    )
  }
}

const onMount = (ref) => {
  window.RAIL_COMPONENTS[ref.props.id] = ref
  LOGGER.info(`Rail added. id=${ref.props.id}, ${ref.props.type}`)  //`
}

const onUnmount = (ref) => {
  LOGGER.info(`Rail deleted. id=${ref.props.id}, ${ref.props.type}`)  //`
  delete window.RAIL_COMPONENTS[ref.props.id]
}

/**
 * レールコンポーネントを生成する。
 * TODO: パフォーマンス
 * @param {RailData} item
 * @param {LayerData} layer
 */
export const createRailComponent = (item: RailData, layer: LayerData, feeders?: FeederInfo[], gapJoiners?: GapJoinerInfo[]) => {
  const {id, type, ...props} = item
  let RailContainer = RailContainers[type]
  if (RailContainer == null) {
    throw Error(`'${type}' is not a valid Rail type!`)
  }
  return (
    <RailContainer
      key={`rail-container-${id}`}
      id={id}
      {...props}
      fillColor={layer.color}
      opacity={layer.opacity || props.opacity}    // Layerの設定を優先する
      visible={layer.visible || props.visible}    // 同上
      // data={{ id: id, type: Type }}
      // (activeTool === Tools.SELECT)
      // (this.props.selectedItem.id === selectedItem || layer.id === selectedItem)
      // HOCでラップされた中身のRailComponentを取得する
      onMount={onMount}
      onUnmount={onUnmount}
      feeders={feeders}
      gapJoiners={gapJoiners}
    />)
}

/**
 * レールグループコンポーネントを作成する。
 * @param {RailGroupData} item
 * @param {RailData[]} children
 * @param {LayerData} layer
 * @returns {any}
 */
export const createRailGroupComponent = (item: RailGroupData, children: RailData[], layer: LayerData) => {
  const {id, type, ...props} = item
  if (type !== 'RailGroup') {
    throw Error(`'${type}' is not a RailGroup!`)
  }

  return (
    <RailContainers.RailGroup
      key={id}
      id={id}
      {...props}
      onMount={(ref) => {
        window.RAIL_GROUP_COMPONENTS[id] = ref
        LOGGER.info(`RailGroup added. id=${id}, ${ref.props.type}`)  //`
      }}
      onUnmount={(ref) => {
        LOGGER.info(`RailGroup deleted. id=${id}, ${ref.props.type}`)  //`
        delete window.RAIL_GROUP_COMPONENTS[id]
      }}
    >
      {children.map(rail => createRailComponent(rail, layer))}
    </RailContainers.RailGroup>
  )
}


/**
 * Point同士を比較し、一致したらtrueを返す
 * @param p1 {Point}
 * @param p2 {Point}
 * @param {number} tolerance 許容誤差
 * @returns {boolean}
 */
export const pointsEqual = (p1: Point, p2: Point, tolerance = 0.0000001) => {
  if (p1 && p2) {
    return (Math.abs(p1.x - p2.x) < tolerance && Math.abs(p1.y - p2.y) < tolerance)
  } else if (! p1 && ! p2) {
    return true
  } else {
    return false
  }
}

/**
 * Angle同士を比較し、一致したらtrueを返す
 * @param a1 {number}
 * @param a2 {number}
 * @param {number} tolerance 許容誤差
 * @returns {boolean}
 */
export const anglesEqual = (a1, a2, tolerance = 0.0000001) => {
  return Math.abs((a1 + 360) % 360 - (a2 + 360) % 360) < tolerance
}

// 上記メソッド、これで良かった説
// export const pointsReasonablyClose = (p1, p2, tolerance) => {
//   return p1.isClose(p2, 0.001)
// }


/**
 * 指定のIDのレールコンポーネントを取得する
 * @param {number} id
 * @returns {RailBase<RailBaseProps, any>}
 */
export const getRailComponent = (id: number): RailBase<RailBaseProps & WithRailBaseProps, any> => {
  return window.RAIL_COMPONENTS[id.toString()]
}

// export const getTemporaryRailComponent = (): RailBase<RailBaseProps, any> => {
//   return window.RAIL_COMPONENTS["-1"]
// }
//
export const getTemporaryRailGroupComponent = (): RailGroup => {
  return window.RAIL_GROUP_COMPONENTS["-1"]
}

/**
 * 全てのレールコンポーネントを取得する
 * @returns {Array<RailBase<RailBaseProps, any>>}
 */
export const getAllRailComponents = (): RailBase<RailBaseProps & WithRailBaseProps, any>[] => {
  return Object.keys(window.RAIL_COMPONENTS).map(key => window.RAIL_COMPONENTS[key])
}

export const getRailComponentsOfLayer = (layerId: number): RailBase<RailBaseProps & WithRailBaseProps, any>[] => {
  return getAllRailComponents().filter(r => r.props.layerId === layerId)
}


export const hasOpenJoint = (rail: RailData): boolean => {
  return _.filter(rail.opposingJoints, v => Boolean(v)).length !== RailComponentClasses[rail.type].defaultProps.numJoints
}


/**
 * ２つのレールが重なっているか否かを調べる
 * @param {number} r1
 * @param {number} r2
 * @returns {any}
 */
export const intersectsBetween = (r1: number, r2: number): boolean => {
  let r1Paths = getRailComponent(r1).railPart.path.children.filter(p => p.data.type === 'Detect')
  if (r1Paths.length === 0) {
    r1Paths = getRailComponent(r1).railPart.path.children
  }
  let r2Paths = getRailComponent(r2).railPart.path.children.filter(p => p.data.type === 'Detect')
  if (r2Paths.length === 0) {
    r2Paths = getRailComponent(r2).railPart.path.children
  }

  const combinations = _.product(r1Paths, r2Paths)
  const result = combinations.map(cmb => cmb[0].intersects(cmb[1])).some(e => e)
  LOGGER.debug(`Rail intersection of ${r1} and {r2}: ${result}`)
  return result
}

/**
 * targetのレールがrailsのレール群に対して重なっているか否かを調べる
 * @param {number} target
 * @param {number[]} rails
 * @returns {boolean}
 */
export const intersectsOf = (target: number, rails: number[]): boolean => {
  const result = rails.map(rail => intersectsBetween(target, rail)).some(e => e)
  LOGGER.debug(`Rail ${target} intersects.`) //`
  return result
}


/**
 * ２つのレールの近傍にあるジョイントを取得する
 * @param {number} r1
 * @param {number} r2
 * @returns {any[]}
 */
export const getCloseJointsBetween = (r1: number, r2: number): JointPair[] => {
  const r1Joints = getRailComponent(r1).joints
  const r2Joints = getRailComponent(r2).joints

  const combinations = _.product(r1Joints, r2Joints)
  const closeJointPairs = []
  combinations.forEach(cmb => {
    // 両方が未接続でなければ抜ける
    if ((cmb[0].props.hasOpposingJoint && cmb[1].props.hasOpposingJoint)
      || (! cmb[0].props.visible || ! cmb[1].props.visible)) {
      return
    }
    // if ( ! cmb[0].props.visible || ! cmb[1].props.visible ) {
    //   return
    // }
    // LOGGER.debug(cmb[0].props.data.railId, cmb[0].globalPosition, cmb[0].globalAngle, cmb[1].props.data.railId, cmb[1].globalPosition, cmb[1].globalAngle)
    // ジョイント同士が十分近く、かつ角度が一致していればリストに加える
    const isClose = pointsEqual(cmb[0].globalPosition, cmb[1].globalPosition, CLOSED_JOINT_DISTANCE_TORELANCE)
    if (! isClose) {
      return
    }
    const isSameAngle = anglesEqual(cmb[0].globalAngle, cmb[1].globalAngle + 180, CLOSED_JOINT_ANGLE_TORELANCE)
    if (! isSameAngle) {
      return
    }

    closeJointPairs.push({
      from: {
        railId: cmb[0].props.data.railId,
        jointId: cmb[0].props.data.partId
      },
      to: {
        railId: cmb[1].props.data.railId,
        jointId: cmb[1].props.data.partId
      }
    })
  })
  return closeJointPairs
}


/**
 * targetのレールの、railsのレール群に対する近傍ジョイントを取得する
 * @param {number} target
 * @param {RailData[]} rails
 * @returns {any[]}
 */
export const getCloseJointsOf = (target: number, rails: RailData[]): JointPair[] => {
  return _.flatMap(rails, r2 => getCloseJointsBetween(target, r2.id))
}


/**
 * 全てのレール同士の近傍ジョイントを取得する
 * @param {RailData[]} rails
 * @returns {any[]}
 */
export const getAllCloseJoints = (rails: RailData[]): JointPair[] => {
  if (rails.length < 2) {
    return []
  } else {
    const combinations = _.combinations(rails.map(r => r.id), 2)
    return _.flatMap(combinations, cmb => getCloseJointsBetween(cmb[0], cmb[1]))
  }
}


/**
 * 未接続のジョイントを持つレール同士の全ての近傍ジョイントを取得する
 * @param {RailData[]} rails
 * @returns {any[]}
 */
export const getAllOpenCloseJoints = (rails: RailData[]): JointPair[] => {
  const railsWithOpenJoints = rails.filter(r => hasOpenJoint(r))
  if (railsWithOpenJoints.length < 2) {
    return []
  } else {
    const combinations = _.combinations(railsWithOpenJoints.map(r => r.id), 2)
    LOGGER.info(combinations)
    return _.flatMap(combinations, cmb => getCloseJointsBetween(cmb[0], cmb[1]))
  }
}

export const normAngle = (angle: number) => {
  return (angle + 360) % 360
}

import * as React from 'react'
import {compose} from 'recompose'

import {Tool} from 'react-paper-bindings'

import withMoveTool, {WithMoveToolProps} from '../hoc/withMoveTool'

import {EditorBody, StyledToolBar, StyledWrapper} from "./Editor.style";

import './Paper.css'
import withSelectTool, {WithSelectToolProps} from "containers/hoc/withSelectTool";
import {inject, observer} from "mobx-react";
import {EditorMode, EditorStore} from "stores/editorStore";
import {LayoutStore} from "stores/layoutStore";
import {GridPaper} from "containers/Editor/GridPaper/GridPaper";
import Layout from "containers/Editor/Layout/Layout";
import {
  DEFAULT_PAPER_BACKGROUND_COLOR,
  DEFAULT_PAPER_COLOR,
  DEFAULT_PAPER_LINE_COLOR,
  DEFAULT_VIEW_HEIGHT,
  DEFAULT_VIEW_WIDTH,
  Tools
} from "constants/tools";
import FreeRailPlacer from "containers/Editor/FreeRailPlacer/FreeRailPlacer";
import {BuilderStore} from "stores/builderStore";
import {getAllRailComponents} from "containers/rails/utils";
import LayoutTips from "containers/Editor/LayoutTips/LayoutTips";
import Palettes from "./Palettes/Palettes";
import {DistantRailPlacer} from "./DistantRailPlacer/DistantRailPlacer";
import TemporaryLayer from "./TemporaryLayer/TemporaryLayer";
import {Measure} from "./Measure/Measure";
import {MeasureEventHandler} from "./MeasureEventHandler/MeasureEventHandler";
import {observable} from "mobx";
import {Snackbar} from "components/Snackbar/Snackbar";
import {UiStore} from "stores/uiStore";
import {STORE_BUILDER, STORE_EDITOR, STORE_LAYOUT, STORE_UI} from "constants/stores";
import withKeyHandler, {WithKeyHandlerProps} from "../hoc/withKeyHandler";

// const LOGGER = getLogger(__filename)


export interface EditorProps {
  width: number
  height: number
  builder?: BuilderStore
  editor?: EditorStore
  layout?: LayoutStore
  ui?: UiStore
}


type EnhancedEditorProps = EditorProps
  & WithKeyHandlerProps
  & WithMoveToolProps
  & WithSelectToolProps


export interface EditorState {
}


@inject(STORE_EDITOR, STORE_LAYOUT, STORE_BUILDER, STORE_UI)
@observer
class Editor extends React.Component<EnhancedEditorProps, EditorState> {

  // マウス位置
  @observable mousePosition = {x: 0, y: 0}

  async componentDidMount() {
    this.props.resetViewPosition()
    this.props.builder.setActiveTool(Tools.STRAIGHT_RAILS)
    window.onbeforeunload = () => {
      return "Dude, are you sure you want to leave? Think of the kittens!";
    }
  }

  buildModeMouseDown = (e) => {
    // this.props.builderMouseDown(e)
    this.props.selectToolMouseDown(e);
    this.props.moveToolMouseDown(e);
    // this.props.moveToolMouseDown(e)
    // Material-UIの要素に変にフォーカスが残ってしまうので、Canvasにいるときは常にBlurして対処
    // TODO: もっとスマートな方法が無いか調べる
    (document.activeElement as HTMLElement).blur();
  }

  buildModeMouseMove = (e) => {
    // this.props.builderMouseMove(e)
    const mousePosition = this.props.moveToolMouseMove(e);
    this.props.moveToolMouseMove(e);
    this.mousePosition = {x: mousePosition.x, y: mousePosition.y}
  }

  buildModeMouseDrag = (e) => {
    this.props.selectToolMouseDrag(e)
    this.props.moveToolMouseDrag(e)
  }

  buildModeMouseUp = (e) => {
    this.props.selectToolMouseUp(e)
    this.props.moveToolMouseUp(e)
  }

  onFrame = (e) => {
    getAllRailComponents().forEach(r => r.onFrame(e))
  }

  // コンテキストメニュー無効化
  noopContextMenu = (e) => {
    e.preventDefault()
    return false;
  }

  closeCommonSnackbar = (e, reason) => {
    // TODO: Snackbarが速攻閉じられてしまう問題を解消するためのWorkaround
    if (reason !== 'clickaway') {
      this.props.ui.setCommonSnackbar(false)
    }
  }


  render() {

    const {paperWidth, paperHeight, gridSize, backgroundImageUrl} = this.props.layout.config

    // LOGGER.debug(`from=${this.props.selectionRectFrom}, to=${this.props.selectionRectTo}`)
    // LOGGER.debug(this.state.mousePosition)

    return (
      <StyledWrapper onContextMenu={this.noopContextMenu}>
        <StyledToolBar resetViewPosition={this.props.resetViewPosition}/>
        <EditorBody>
          <Palettes/>
          <LayoutTips/>
          <DistantRailPlacer/>

          <GridPaper
            viewWidth={DEFAULT_VIEW_WIDTH}
            viewHeight={DEFAULT_VIEW_HEIGHT}
            paperWidth={paperWidth}
            paperHeight={paperHeight}
            paperColor={DEFAULT_PAPER_COLOR}
            backgroundColor={DEFAULT_PAPER_BACKGROUND_COLOR}
            backgroundImageUrl={backgroundImageUrl}
            lineColor={DEFAULT_PAPER_LINE_COLOR}
            gridSize={gridSize}
            onWheel={this.props.moveToolMouseWheel}
            onFrame={this.onFrame}
          >
            {/* 後から書いたコンポーネントの方が前面に配置される */}
            <MeasureEventHandler
              active={this.props.builder.activeTool === Tools.MEASURE}
              mousePosition={this.mousePosition}
            />

            <TemporaryLayer/>

            <FreeRailPlacer mousePosition={this.mousePosition}/>

            <Layout/>

            {this.props.selectionLayer}

            {
              this.props.editor.mode === EditorMode.BUILDER &&
              this.props.builder.activeTool === Tools.MEASURE &&
              <Measure mousePosition={this.mousePosition}/>
            }

            <Tool
              active={this.props.editor.mode === EditorMode.BUILDER}
              name={'Builder Mode Global Handler'}
              onMouseDown={this.buildModeMouseDown}
              onMouseMove={this.buildModeMouseMove}
              onMouseDrag={this.buildModeMouseDrag}
              onMouseUp={this.buildModeMouseUp}
            />
          </GridPaper>
        </EditorBody>
        <Snackbar open={this.props.ui.commonSnackbar}
                  onClose={this.closeCommonSnackbar}
                  message={this.props.ui.commonSnackbarMessage}
                  variant={this.props.ui.commonSnackbarVariant}
        />
      </StyledWrapper>
    )
  }

}


export default compose<EditorProps | any, EditorProps | any>(
  // withFullscreen,
  withKeyHandler,
  withMoveTool,
  withSelectTool,
  // connect(mapStateToProps, mapDispatchToProps)
)(Editor)


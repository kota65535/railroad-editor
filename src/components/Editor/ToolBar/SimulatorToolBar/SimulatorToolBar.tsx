import * as React from 'react'
import {Grid, Tooltip} from '@material-ui/core'
import {Tools} from "constants/tools";
import getLogger from "logging";
import {LayoutStore} from "store/layoutStore";
import {inject, observer} from "mobx-react";
import {STORE_BUILDER, STORE_COMMON, STORE_LAYOUT, STORE_LAYOUT_LOGIC} from "constants/stores";
import {CommonStore} from "store/commonStore";
import {compose} from "recompose";
import Peer from 'skyway-js';
import {LayoutLogicStore} from "store/layoutLogicStore";
import withMoveTool from "components/hoc/withMoveTool";
import {StyledIconButton} from "components/Editor/ToolBar/styles";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";

const LOGGER = getLogger(__filename)


export interface SimulatorToolBarProps {
  common?: CommonStore
  layout?: LayoutStore
  layoutLogic?: LayoutLogicStore

  resetViewPosition: () => void
  snackbar: any
}

export interface SimulatorToolBarState {
  openSettings: boolean
  el: HTMLElement | undefined
}

type EnhancedSimulatorToolBarProps = SimulatorToolBarProps



@inject(STORE_COMMON, STORE_BUILDER, STORE_LAYOUT, STORE_LAYOUT_LOGIC)
@observer
export class SimulatorToolBar extends React.Component<EnhancedSimulatorToolBarProps, SimulatorToolBarState> {

  myPeerId: string
  peer: Peer
  targetPeerId: string
  conn: any

  constructor(props: EnhancedSimulatorToolBarProps) {
    super(props)
    this.state = {
      openSettings: false,
      el: undefined,
    }
  }

  componentDidMount() {
    this.peer = new Peer({
      key: '423ec210-715b-4916-971f-bd800a835414',
      debug: 3,
    });
    // Show this peer's ID.
    this.peer.on('open', id => {
      this.myPeerId = id
      console.log('open', this.myPeerId)
    });

  }

  openSettingsDialog = (e) => {
    this.setState({
      openSettings: true
    })
  }

  closeSettingsDialog = () => {
    this.setState({
      openSettings: false
    })
  }

  connectWebRTC = () => {
    const connectedPeers = {};
    const requestedPeer = "C1yv3nGCQGzgdcFs"
    if (!connectedPeers[requestedPeer]) {
      this.conn = this.peer.connect(requestedPeer, {
        label:    'chat',
        metadata: {message: 'hi i want to chat with you!'},
      });
      this.conn.on('open', (id) => {
        console.log('open', id)
      });
      this.conn.on('error', err => alert(err));

      this.conn.on('data', data => {
        console.log('data', data)
      });

      this.conn.on('close', () => {
      });
    }
  }

  sendSomething = () => {
    this.conn.send('hello!')
  }


  render() {
    return (
      <Grid xs justify="center" alignItems="center" style={{display: 'flex'}}>
        <Tooltip title={Tools.RESET_VIEW}>
          <StyledIconButton
            onClick={this.props.resetViewPosition}
          >
            <AspectRatioIcon/>
          </StyledIconButton>
        </Tooltip>

      </Grid>
    )
  }
}


export default compose<SimulatorToolBarProps, SimulatorToolBarProps|any>(
  withMoveTool
)(SimulatorToolBar)
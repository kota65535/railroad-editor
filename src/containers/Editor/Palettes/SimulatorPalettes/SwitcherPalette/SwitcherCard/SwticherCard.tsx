import * as React from 'react'
import {Grid, MenuItem, Typography} from '@material-ui/core'
import getLogger from "logging";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import {ConductionStates, SwitcherData} from "stores/layoutStore";
import {inject, observer} from 'mobx-react';
import SwitcherSettingDialog
  from "containers/Editor/Palettes/SimulatorPalettes/SwitcherPalette/SwitcherSettingDialog/SwitcherSettingDialog";
import {
  NarrowCardContent,
  NarrowCardHeader,
} from "containers/Editor/Palettes/SimulatorPalettes/SwitcherPalette/SwitcherCard/SwitchCard.style";
import DeleteIcon from '@material-ui/icons/Delete';
import 'react-grid-layout/css/styles.css'
import {TurnoutStateTable} from "containers/Editor/Palettes/SimulatorPalettes/SwitcherPalette/SwitcherCard/TurnoutStateTable/TurnoutStateTable";
import {Triangle} from "containers/Editor/Palettes/SimulatorPalettes/PowerPackPalette/PowerPackCard/PowerPackCard.style";
import {FeederInfo} from "react-rail-components";
import {WithLayoutStore} from "stores";
import {WithSwitcherUseCase} from "useCases";
import {STORE_LAYOUT} from 'constants/stores';
import {USECASE_SWITCHER} from 'constants/useCases';


const LOGGER = getLogger(__filename)


export type SwitcherCardProps = {
  item: SwitcherData
  feeders: FeederInfo[]
} & WithLayoutStore & WithSwitcherUseCase

export interface SwitcherCardState {
  anchorEl: HTMLElement
  sliderValue: number
  sliderDragging: boolean
  direction: boolean
  dialogOpen: boolean
}

export interface InversedConductionStates {
  [railId: number]: InversedConductionState
}

export interface InversedConductionState {
  [switchState: number]: number     // Rail's conductionState
}


@inject(STORE_LAYOUT, USECASE_SWITCHER)
@observer
export class SwitcherCard extends React.Component<SwitcherCardProps, SwitcherCardState> {


  constructor(props: SwitcherCardProps) {
    super(props)
    this.state = {
      anchorEl: null,
      sliderValue: 0,
      sliderDragging: false,
      direction: true,
      dialogOpen: false,
    }
  }

  openMenu = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({anchorEl: e.currentTarget});
  }

  onMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({anchorEl: null})
  }

  onSetting = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({
      dialogOpen: true
    })
    this.onMenuClose(e)
  }

  onSettingDialogClosed = () => {
    this.setState({
      dialogOpen: false
    })
  }

  onDelete = (e: React.MouseEvent<HTMLElement>) => {
    this.props.switcherUseCase.deleteSwitcher({
      id: this.props.item.id
    })
    this.onMenuClose(e)
  }

  /**
   * SwitcherのConductionStatesを、このコンポーネントで表示するための形式に変換する。
   *
   * {
   *   [railId]: {
   *     [switchState]: [railConductionState],
   *     ...
   *   }
   *
   *   1: {
   *     0: 0,
   *     1: 1
   *   },
   *   2: {
   *     0: 1,
   *     1: 0
   *   }
   * }
   *
   * @param {ConductionStates} conductionStates
   * @returns {{}}
   */
  transformSwitcherConductionStates = (conductionStates: ConductionStates): InversedConductionStates => {
    const rails = {}
    _.keys(conductionStates).forEach(stateIdxStr => {
      const stateIdx = Number(stateIdxStr)
      conductionStates[stateIdx].forEach(state => {
        if (! rails[state.railId]) {
          rails[state.railId] = {}
        }
        rails[state.railId][stateIdx] = state.conductionState
      })
    })
    return rails
  }


  onDisconnect = (railId: number) => (e) => {
    this.props.switcherUseCase.disconnectTurnoutFromSwitcher(Number(railId))
  }


  render() {
    const {name, conductionStates, color} = this.props.item
    const transformedConductionStates = this.transformSwitcherConductionStates(conductionStates)

    LOGGER.info('conductionStates', conductionStates)
    LOGGER.info('transformedConductionStates', transformedConductionStates)


    return (
      <>
        <Card>
          <Triangle color={color}/>
          <NarrowCardHeader
            title={name}
            action={
              <IconButton
                onClick={this.openMenu}
              >
                <MoreVertIcon/>
              </IconButton>
            }
            // style={{paddingTop: '16px', paddingBottom: '8px'}}
          />
          <NarrowCardContent>
            {_.keys(transformedConductionStates).map(railIdStr => {
              const railId = Number(railIdStr)
              const rail = this.props.layout.getRailDataById(railId)
              return (
                <Grid container justify="center" alignItems="center" spacing={0}>
                  <Grid item xs={3}>
                    <Typography align="center"> {rail.turnoutName} </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TurnoutStateTable switcher={this.props.item} rail={rail}/>
                  </Grid>
                  <Grid item xs={3} justify="flex-end">
                    <IconButton style={{width: '40px', height: '40px'}}
                                onClick={this.onDisconnect(railId)}
                    >
                      <DeleteIcon style={{width: '20px', height: '20px'}}/>
                    </IconButton>
                  </Grid>
                </Grid>
              )
            })}
          </NarrowCardContent>
        </Card>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.onMenuClose}
        >
          <MenuItem onClick={this.onSetting}>Setting</MenuItem>}
          <MenuItem onClick={this.onDelete}>Delete</MenuItem>}
        </Menu>
        <SwitcherSettingDialog
          title={'Switcher Settings'}
          open={this.state.dialogOpen}
          onClose={this.onSettingDialogClosed}
          switcher={this.props.item}
          updateSwitcher={this.props.switcherUseCase.updateSwitcher}
        />
      </>
    )
  }
}



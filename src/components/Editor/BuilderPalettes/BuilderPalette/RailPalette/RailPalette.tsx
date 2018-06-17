import * as React from 'react'
import {ReactNode} from 'react'
import {CenteredDiv, HideableDiv, PaletteBodyPaper, ScrollablePaper, StyledSelector,} from "./style";
import {TitleDiv} from "../../LayerPalette/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {inject, observer} from "mobx-react";
import {STORE_BUILDER} from "constants/stores";
import {BuilderStore} from "store/builderStore";
import * as classNames from "classnames"
import {PrimaryPaletteAddButton} from "components/common/PaletteAddButton/PaletteAddButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddBoxIcon from "@material-ui/icons/AddBox";
import {Scrollbars} from 'react-custom-scrollbars';


export interface RailPaletteProps {
  className?: string
  active: boolean
  title: string
  icon: ReactNode
  items: PaletteItem[]
  customItems?: any[]
  customDialog?: ReactNode
  openCustomDialog?: (e: React.SyntheticEvent<HTMLElement>) => void
  tooltipTitle?: string
  builder?: BuilderStore
  helpMessage?: string
}


@inject(STORE_BUILDER)
@observer
export default class RailPalette extends React.Component<RailPaletteProps, {}> {

  constructor(props: RailPaletteProps) {
    super(props)
    this.state = {
      addDialogOpen: false
    }
  }

  render() {
    let presetItems, customItems, helpMessage
    if (! _.isEmpty(this.props.items)) {
      presetItems = (
        <StyledSelector
          items={this.props.items}
          selectItem={this.props.builder.setPaletteItem}
          paletteItem={this.props.builder.paletteItem}
        />
      )
    }
    if (! _.isEmpty(this.props.customItems)) {
      customItems = (
        <>
          <Divider/>
          <StyledSelector
            items={this.props.customItems}
            selectItem={this.props.builder.setPaletteItem}
            paletteItem={this.props.builder.paletteItem}
            hasMenu
          />
        </>
      )
    }

    if (this.props.customDialog && _.isEmpty(this.props.customItems)) {
      const splitMessages = this.props.helpMessage.split('+')
      helpMessage = (
        <>
          <Divider/>
          <CenteredDiv>
            <Typography align="left">
              {splitMessages[0]} <AddBoxIcon color="primary" style={{fontSize: '16px', marginBottom: '-3px'}}/> {splitMessages[1]}
            </Typography>
          </CenteredDiv>
        </>
      )
    }

    return (
      // styleを上書きするために必要
      <div className={this.props.className}>
        <HideableDiv className={classNames({
          'hidden': ! this.props.active
        })}
        >
          <PaletteBodyPaper>
            <TitleDiv className='Palette__title'>
              {this.props.icon}
              <Typography variant="subheading" color="inherit" style={{flex: 1}}>
                {this.props.title}
              </Typography>
              {this.props.customDialog &&
              <Tooltip title={this.props.tooltipTitle}>
                <PrimaryPaletteAddButton onClick={this.props.openCustomDialog}/>
              </Tooltip>
              }
            </TitleDiv>
            <ScrollablePaper>
              {presetItems}
              {customItems}
              {helpMessage}
            </ScrollablePaper>
          </PaletteBodyPaper>
        </HideableDiv>
        {this.props.customDialog}
      </div>
    )
  }
}

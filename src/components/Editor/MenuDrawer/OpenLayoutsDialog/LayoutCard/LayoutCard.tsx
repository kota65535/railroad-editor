import * as React from 'react'
import {ReactEventHandler} from 'react'
import {CardContent, CardHeader, MenuItem} from "material-ui"
import Typography from "material-ui/Typography";
import {S3Image} from 'aws-amplify-react';
import getLogger from "logging";
import * as moment from "moment";
import Menu from "material-ui/Menu";
import Button from "material-ui/Button";
import MoreVertIcon from 'material-ui-icons/MoreVert';
import styled from "styled-components";
import IconButton from "material-ui/IconButton";
import Card from "material-ui/Card";

const LOGGER = getLogger(__filename)


export interface LayoutCardProps {
  imgKey: string
  title: string
  lastModified: number
  onClick: ReactEventHandler<HTMLElement>
  onRename: ReactEventHandler<HTMLElement>
  onDelete: ReactEventHandler<HTMLElement>
}

export interface LayoutCardState {
  anchorEl: HTMLElement
}


export class LayoutCard extends React.Component<LayoutCardProps, LayoutCardState> {

  constructor(props: LayoutCardProps) {
    super(props)
    this.state = {
      anchorEl: null
    }

  }

  openMenu = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: e.currentTarget });
  }

  onMenuClose = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({anchorEl: null})
  }

  onRename = (e: React.MouseEvent<HTMLElement>) => {
    this.props.onRename(e)
    this.onMenuClose(e)
  }

  onDelete = (e: React.MouseEvent<HTMLElement>) => {
    this.props.onDelete(e)
    this.onMenuClose(e)
  }

  render() {
    const {imgKey, title, lastModified} = this.props
    return (
      <>
        <Card>
          <CardHeader
            title={title}
            action={
              <IconButton
                onClick={this.openMenu}
              >
                <MoreVertIcon/>
              </IconButton>
            }
            style={{paddingTop: '16px', paddingBottom: '8px'}}
          />
          <Button
            onClick={this.props.onClick}
          >
          <CardContent>
            <S3Image level={'private'} imgKey={imgKey}/>
            <Typography align="left" variant="body2">
              Last modified: {moment(lastModified).format('YYYY/MM/DD, hh:mm')}
            </Typography>
          </CardContent>
          </Button>
        </Card>
        <Menu
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.onMenuClose}
        >
          <MenuItem onClick={this.onDelete}>Delete</MenuItem>}
        </Menu>
      </>
    )
  }
}


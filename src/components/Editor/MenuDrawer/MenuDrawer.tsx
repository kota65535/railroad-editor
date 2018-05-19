import * as React from "react";
import {ListItem, ListItemIcon, ListItemText} from "material-ui";
import Drawer from "material-ui/Drawer";
import List from "material-ui/List";
import CloudIcon from "material-ui-icons/Cloud";
import OpenInNewIcon from "material-ui-icons/OpenInNew";
import SaveIcon from "material-ui-icons/Save";
import SigninIcon from "material-ui-icons/PermIdentity";
import LoginIcon from "material-ui-icons/LockOpen";
import LogoutIcon from "material-ui-icons/Lock";
import ArchiveIcon from "material-ui-icons/Archive";
import OpenLayoutsDialog from "components/Editor/MenuDrawer/OpenLayoutsDialog/OpenLayoutsDialog";
import Auth from "aws-amplify/lib/Auth";
import StorageAPI from "apis/storage"
import Divider from "material-ui/Divider";
import getLogger from "logging";
import {inject, observer} from "mobx-react";
import {STORE_BUILDER, STORE_COMMON, STORE_LAYOUT, STORE_UI} from "constants/stores";
import {CommonStore} from "store/commonStore";
import {LayoutConfig, LayoutData, LayoutMeta, LayoutStore} from "store/layoutStore";
import {BuilderStore} from "store/builderStore";
import SaveLayoutDialog from "components/Editor/MenuDrawer/SaveLayoutDialog/SaveLayoutDialog";
import * as moment from "moment";
import {withSnackbar} from 'material-ui-snackbar-provider'
import {compose} from "recompose";
import LoginDialog from "components/Editor/ToolBar/LoginDialog/LoginDialog";
import SignUpDialog from "components/Editor/ToolBar/SignUpDialog/SignUpDialog";
import {UiStore} from "store/uiStore";
import {KeyLabel} from "components/common/KeyLabel/KeyLabel";
import {when} from "mobx";

const LOGGER = getLogger(__filename)


export interface MenuDrawerProps {
  open: boolean
  onClose: () => void

  common?: CommonStore
  layout?: LayoutStore
  builder?: BuilderStore
  ui?: UiStore

  snackbar: any
}

export interface MenuDrawerState {
}


@inject(STORE_COMMON, STORE_BUILDER, STORE_LAYOUT, STORE_UI)
@observer
export class MenuDrawer extends React.Component<MenuDrawerProps, MenuDrawerState> {

  constructor(props: MenuDrawerProps) {
    super(props)
    this.state = {}
  }


  /**
   * レイアウトを上書き保存するロジック
   * @returns {Promise<void>}
   */
  save = async (meta: LayoutMeta, config: LayoutConfig, layoutData: LayoutData) => {
    const {userRailGroups, userRails} = this.props.builder
    const userId = this.props.common.userInfo.username
    const savedData = {
      layout: layoutData,
      meta: meta,
      userRailGroups: userRailGroups,
      userCustomRails: userRails,
    }
    LOGGER.info(savedData)
    // レイアウトをセーブ
    await this.props.layout.saveLayout()
    // レイアウト画像をセーブ
    await StorageAPI.saveCurrentLayoutImage(userId, meta.id)
    // 背景画像が設定されていたらセーブ
    if (config.backgroundImageUrl) {
      await StorageAPI.saveBackgroundImage(userId, meta.id, config.backgroundImageUrl)
    }
  }

  logout = async () => {
    await Auth.signOut()
    this.props.common.setAuthData(null)
    this.props.onClose()
  }

  openLoginDialogIfNot = () => {
    if (! this.props.common.isAuth) {
      this.props.snackbar.showMessage('Please login.')
      this.setState({ openLogin: true })
      return true
    }
    return false
  }

  openLayoutsDialog = () => {
    this.props.ui.setLayoutsDialog(true, this.props.snackbar.showMessage)
  }

  closeLayoutsDialog = () => {
    this.props.ui.setLayoutsDialog(false)
    this.props.onClose()
  }

  openCreateNewDialog = () => {
    this.props.ui.setCreateNewDialog(true, this.props.snackbar.showMessage)
  }

  closeCreateNewDialog = () => {
    this.props.ui.setCreateNewDialog(false)
    this.props.onClose()
  }

  openSaveNewDialog = () => {
    this.props.ui.setSaveNewDialog(true, this.props.snackbar.showMessage)
  }

  closeSaveNewDialog = () => {
    this.props.ui.setSaveNewDialog(false)
    this.props.onClose()
  }

  openLoginDialog = () => {
    this.props.ui.setLoginDialog(true)
  }

  closeLoginDialog = () => {
    this.props.ui.setLoginDialog(false)
    this.props.onClose()
  }

  openSignUpDialog = () => {
    this.props.ui.setSignInDialog(true)
  }

  closeSignUpDialog = () => {
    this.props.ui.setSignInDialog(false)
    this.props.onClose()
  }

  onSave = async () => {
    if (this.openLoginDialogIfNot()) {
      return
    }
    // 現在のストアのデータを保存する
    const {meta, config, currentLayoutData} = this.props.layout
    await this.save(meta, config, currentLayoutData)
    this.props.snackbar.showMessage("Saved successfully.")
    await this.props.common.loadLayoutList()
    this.props.onClose()
  }

  onSaveAs = async (meta: LayoutMeta) => {
    if (this.openLoginDialogIfNot()) {
      return
    }
    // metaだけダイアログで生成したものを使う
    const {config, currentLayoutData} = this.props.layout
    await this.save(meta, config, currentLayoutData)
    this.props.snackbar.showMessage(`Saved successfully as "${meta.name}".`)  //`
    await this.props.common.loadLayoutList()
    this.props.onClose()
  }

  /**
   * レイアウトをSVGファイルに変換し、ダウンロードする。
   * @param e
   */
  downloadAsSVG = (e) => {
    const basename = this.props.layout.meta.name
    const fileName = `${basename}-${moment().format('YYYYMMDD')}`  //`

    const svg = window.PAPER_SCOPE.project.exportSVG({asString:true})
    const url = "data:image/svg+xml;utf8," + encodeURIComponent(svg)
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
  }


  render() {
    const { open, onClose, ui }  = this.props

    let authMenu, dialogs
    if (this.props.common.isAuth) {
      // For logined users
      authMenu = (
        <ListItem button onClick={this.logout}>
          <ListItemIcon>
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary="Logout"/>
        </ListItem>
      )
      dialogs = (
        <>
          <SaveLayoutDialog
            title={"Save Layout"}
            open={ui.saveNewDialog} onClose={this.closeSaveNewDialog}
            onOK={this.onSaveAs}
            authData={this.props.common.userInfo}
            layoutConfig={this.props.layout.config}
          />
          <OpenLayoutsDialog
            open={ui.layoutsDialog}
            onClose={this.closeLayoutsDialog}
            authData={this.props.common.userInfo}
            layouts={this.props.common.layouts}
            loadLayout={this.props.layout.loadLayout}
            loadLayoutList={this.props.common.loadLayoutList}
          />
        </>
      )
    } else {
      // For not logined users
      authMenu = (
        <>
          <ListItem button onClick={this.openSignUpDialog}>
            <ListItemIcon>
              <SigninIcon/>
            </ListItemIcon>
            <ListItemText primary="Sign-Up"/>
          </ListItem>
          <ListItem button onClick={this.openLoginDialog}>
            <ListItemIcon>
              <LoginIcon/>
            </ListItemIcon>
            <ListItemText primary="Login"/>
          </ListItem>
        </>
      )
      dialogs = (
        <>
          <LoginDialog
            open={ui.loginDialog}
            onClose={this.closeLoginDialog}
            setAuthData={this.props.common.setAuthData}
            loadLayoutList={this.props.common.loadLayoutList}
          />
          <SignUpDialog
            open={ui.signInDialog}
            onClose={this.closeSignUpDialog}
            setAuthData={this.props.common.setAuthData}
            loadLayoutList={this.props.common.loadLayoutList}
          />
        </>
      )
    }


    return (
      <>
        <Drawer
          open={open}
          onClose={onClose}
          anchor="left"
        >
          <List>

            {authMenu}

            <Divider />
            <ListItem button onClick={this.openLayoutsDialog}>
              <ListItemIcon>
                <CloudIcon/>
              </ListItemIcon>
              <ListItemText primary="My Layouts"/>
              <KeyLabel text={'Ctrl + O'}/>
            </ListItem>
            <ListItem button onClick={this.openCreateNewDialog}>
              <ListItemIcon>
                <OpenInNewIcon/>
              </ListItemIcon>
              <ListItemText primary="New Layout"/>
              <KeyLabel text={'Ctrl + N'}/>
            </ListItem>
            <ListItem button onClick={this.onSave}>
              <ListItemIcon>
                <SaveIcon/>
              </ListItemIcon>
              <ListItemText primary="Save"/>
              <KeyLabel text={'Ctrl + S'}/>
            </ListItem>
            <ListItem button onClick={this.openSaveNewDialog}>
              <ListItemIcon>
                <SaveIcon/>
              </ListItemIcon>
              <ListItemText primary="Save As..."/>
            </ListItem>
            <ListItem button onClick={this.downloadAsSVG}>
              <ListItemIcon>
                <ArchiveIcon/>
              </ListItemIcon>
              <ListItemText primary="Export as SVG"/>
            </ListItem>
          </List>

        </Drawer>

        <SaveLayoutDialog
          title={"Create New Layout"}
          open={ui.createNewDialog}
          onClose={this.closeCreateNewDialog}
          onOK={this.onSaveAs}
          authData={this.props.common.userInfo}
          layoutConfig={this.props.layout.config}
        />
        {dialogs}
      </>
    )
  }
}


export default compose<MenuDrawerProps, MenuDrawerProps|any>(
  withSnackbar()
)(MenuDrawer)

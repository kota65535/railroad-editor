import * as React from 'react'
import {List} from '@material-ui/core'
import PaletteListItem
  from "containers/Editor/Palettes/BuilderPalettes/RailPalettes/RailPalette/PaletteListItem/PaletteListItem";
import {inject, observer} from "mobx-react";
import {BuilderStore} from "store/builderStore";
import {PaletteItem} from "store";
import {STORE_BUILDER} from "store/constants";

export interface SelectorProps {
  items: PaletteItem[]
  paletteItem: PaletteItem
  selectItem: (item: PaletteItem) => void
  hasMenu?: boolean
  builder?: BuilderStore
}


@inject(STORE_BUILDER)
@observer
export default class Selector extends React.Component<SelectorProps, {}> {

  constructor(props: SelectorProps) {
    super(props)
  }

  onDelete = (item: PaletteItem) => {
    if (item.type === 'RailGroup') {
      this.props.builder.deleteUserRailGroup(item)
    } else {
      this.props.builder.deleteUserRail(item)
    }
  }

  render() {
    const {items, paletteItem, selectItem, hasMenu} = this.props
    const onDelete = hasMenu ? this.onDelete : undefined
    return (
      <List>
        {items.map((value, index) => {
          return (
            <PaletteListItem
              item={value}
              selectItem={selectItem}
              paletteItem={paletteItem}
              hasMenu={hasMenu}
              onDelete={onDelete}
              key={index}
            />
          )
        })}
      </List>
    )
  }
}


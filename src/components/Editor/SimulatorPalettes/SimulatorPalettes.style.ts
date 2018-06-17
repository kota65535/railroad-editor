import styled from "styled-components";
import Rnd from "react-rnd"
import LayerPalette from "components/Editor/BuilderPalettes/LayerPalette/LayerPalette";
import BuilderPalette from "components/Editor/BuilderPalettes/BuilderPalette/BuilderPalette";
import PowerPackPalette from "components/Editor/SimulatorPalettes/PowerPackPalette/PowerPackPalette";
import SwitcherPalette from "components/Editor/SimulatorPalettes/SwitcherPalette/SwitcherPalette";


export const StyledRnd = styled(Rnd as any)`
  z-index: 50;
  // overwrite Rnd's inline style
  //width: 100%!important;
  //height: 100%!important;
`

export const StyledPowerPackPalette = styled(PowerPackPalette as any)`
  // Rndのインラインスタイルである top:0, left:0 を打ち消す
  top: 10px!important;
  left: 10px!important;
  //top: 10px!important;
  //left: 10px!important;
  //width: 200px!important;
`

export const StyledSwitcherPalette = styled(SwitcherPalette as any)`
  // Rndのインラインスタイルである top:0, left:0 を打ち消す
  top: 10px!important;
  left: auto!important;
  right: 10px;
  //top: 10px!important;
  //left: 10px!important;
  //width: 200px!important;
`
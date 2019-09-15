import CommonStore from "store/commonStore";
import BuilderStore, {BuilderStoreState} from "store/builderStore";
import LayoutStore, {LayoutStoreState} from "store/layoutStore";
import UiStore from "store/uiStore";
import LayoutLogicStore from "store/layoutLogicStore";
import SimulatorLogicStore from "store/simulatorLogicStore";
import PaperStore from "./paperStore.";
import SimulatorStore from "./simulatorStore";
import FreeRailPlacerStore, {FreeRailPlacerStoreState} from "./freeRailPlacerStore";
import MeasureStore, {MeasureStoreState} from "./measureStore";

export interface AppState {
  builder: BuilderStoreState
  freeRailPlacer: FreeRailPlacerStoreState
  measure: MeasureStoreState
  layout: LayoutStoreState
}

export default () => {
  return {
    common: CommonStore,
    builder: BuilderStore,
    freeRailPlacer: FreeRailPlacerStore,
    measure: MeasureStore,
    layout: LayoutStore,
    layoutLogic: LayoutLogicStore,
    simulator: SimulatorStore,
    simulatorLogic: SimulatorLogicStore,
    ui: UiStore,
    paper: PaperStore
  };
}

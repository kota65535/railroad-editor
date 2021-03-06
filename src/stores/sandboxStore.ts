import {action, observable} from "mobx";


export interface SandboxStoreState {
  sandbox: any
  sandboxEnabled: boolean
  errorSnackbar: boolean
  errorSnackbarMessage: string
}

const INITIAL_STATE: SandboxStoreState = {
  sandbox: null,
  sandboxEnabled: true,
  errorSnackbar: false,
  errorSnackbarMessage: ''
}


export class SandboxStore {
  @observable sandbox: any
  @observable sandboxEnabled: boolean
  @observable errorSnackbar: boolean
  @observable errorSnackbarMessage: string

  constructor({sandbox, sandboxEnabled, errorSnackbar, errorSnackbarMessage}: SandboxStoreState) {
    this.sandbox = sandbox
    this.sandboxEnabled = sandboxEnabled
    this.errorSnackbar = errorSnackbar
    this.errorSnackbarMessage = errorSnackbarMessage
  }

  @action
  setSandbox = (sandbox: any) => {
    this.sandbox = sandbox
    this.sandboxEnabled = !! sandbox;
  }

  @action
  setSandboxEnabled = (enabled: boolean) => {
    this.sandboxEnabled = enabled
  }

  @action
  setErrorSnackbar = (open: boolean, message: string) => {
    this.errorSnackbar = open
    this.errorSnackbarMessage = message
  }
}

export default new SandboxStore(INITIAL_STATE)

import AppManager from '../scripts/Framework/AppManager'
declare global {
  interface Window {
    app: typeof AppManager
    async: any
  }
}

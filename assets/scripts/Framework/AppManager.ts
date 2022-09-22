import { WordsData } from '../data/WordsData'

class AppManager {
  public static readonly Instance = new AppManager()
  private _wordData: WordsData = null
  /**
   * 当前画布中定义的所有成语
   * getWordsData
   */
  public getWordsData() {
    if (!this._wordData) {
      this._wordData = new WordsData()
    }
    return this._wordData
  }
}
export default AppManager.Instance

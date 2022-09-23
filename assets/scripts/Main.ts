import { _decorator, Component, Label } from 'cc'
import { GRID_STATUS } from './Framework/Constant'
import WordsLib from './Framework/WordsLib'
import { LayoutGrids } from './LayoutGrids'
import { NodeGrid } from './NodeGrid'
import { HHelpTool } from './Framework/HHelpTool'
const { ccclass, property } = _decorator

@ccclass('Main')
export class Main extends Component {
  @property(LayoutGrids)
  nodeLayoutGrids: LayoutGrids = null

  @property(Label)
  levelNode: Label = null

  private _curLevel = 1

  start() {
    this.levelNode.string = `当前关：第${this._curLevel}关`
  }
  /**
   * 清除所有
   */
  onPressClear() {
    this.nodeLayoutGrids.getComponent(LayoutGrids).clearAllGrids()
  }
  /**
   * 保存关卡
   */
  exportData() {
    const otherInfo = this.nodeLayoutGrids
      .getComponent(LayoutGrids)
      .getAllWords()
    HHelpTool.creatJosnFile(otherInfo, `${this._curLevel}.json`)
    this._curLevel++
    this.levelNode.string = `当前关：第${this._curLevel}关`
    this.onPressClear()
  }
  /**
   * 删词
   */
  onPressDeleteWord() {
    this.nodeLayoutGrids.getComponent(LayoutGrids).deleteLastWord()
  }
  /**
   * 随机换词
   * 获取最新插入的一个成语
   *
   */
  onRandomChangeWord() {
    let lastWord = window.app.getWordsData().getLastWord()
    WordsLib.replaceWord(lastWord)
  }
  /**
   * 指定去字
   */
  private _removeChars(INWord: NodeGrid[]) {
    let emptyNums = 0
    // 1. 确定当前空的数量
    INWord.forEach((item) => {
      const curWord = item.getComponent(NodeGrid)
      if (curWord.getGridItemStatus() === GRID_STATUS.REMOVE_CHAR) {
        emptyNums++
      }
    })
    let randNums = 2 - emptyNums
    while (randNums > 0) {
      let randValue = Math.floor(Math.random() * 4)
      const curWord = INWord[randValue].getComponent(NodeGrid)
      if (curWord.getGridItemStatus() !== GRID_STATUS.REMOVE_CHAR) {
        curWord.removeChar()
        randNums--
      }
    }
  }
  /**
   * 去字
   */
  onPressRemoveChar() {
    let totalWords = window.app.getWordsData().getAllWords()
    totalWords.forEach((item) => {
      this._removeChars(item)
    })
  }
  /**
   * 获取当前关
   * @returns number
   */
  getLevel(): number {
    return this._curLevel
  }
  /**
   * 设置当前关
   * @param lv
   */
  setLevel(lv: number) {
    this._curLevel = lv
  }
}

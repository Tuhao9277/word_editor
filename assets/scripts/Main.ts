import { _decorator, Component } from 'cc'
import { GRID_STATUS } from './Framework/Constant'
import { LayoutGrids } from './LayoutGrids'
import { NodeGrid } from './NodeGrid'
const { ccclass, property } = _decorator

@ccclass('Main')
export class Main extends Component {
  @property(LayoutGrids)
  nodeLayoutGrids: LayoutGrids = null
  /**
   * 清除所有
   */
  onPressClear() {
    this.nodeLayoutGrids.getComponent(LayoutGrids).clearAllGrids()
  }
  /**
   * 删除最后一个词
   */
  onPressDeleteWord() {
    this.nodeLayoutGrids.getComponent(LayoutGrids).deleteLastWord()
  }
  /**
   * 删除指定字符
   */
  _removeChars(INWord: NodeGrid[]) {
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
   * 移除字符
   */
  onPressRemoveChar() {
    let totalWords = window.app.getWordsData().getAllWords()
    totalWords.forEach((item) => {
      this._removeChars(item)
    })
  }
}

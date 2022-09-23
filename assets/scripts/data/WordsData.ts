import { initial, last } from 'lodash-es'
import { NodeGrid } from '../NodeGrid'

export class WordsData {
  private _totalWords: NodeGrid[][] = []
  /**
   * 添加一个NodeGrid[]
   * @param INWord NodeGrid[]
   */
  pushWord(INWord: NodeGrid[]) {
    this._totalWords.push(INWord)
  }
  /**
   * 移除新增的NodeGrid[] */
  popWord() {
    this._totalWords.pop()
  }
  /**
   * 获取最新的NodeGrid[] */
  getLastWord() {
    if (this._totalWords.length > 0) {
      return last(this._totalWords)
    }
  }
  /**
   * 获取并删除最后一个成语 */
  getAndDeleteLastWord() {
    if (this._totalWords.length > 0) {
      let lastWord = last(this._totalWords)
      this._totalWords = initial(this._totalWords)
      return lastWord
    }
  }
  /**
   * 清空已存成语
   */
  clearWords() {
    this._totalWords = []
  }
  /**
   * 返回所有节点成语
   */
  getAllWords() {
    return this._totalWords
  }
 
}

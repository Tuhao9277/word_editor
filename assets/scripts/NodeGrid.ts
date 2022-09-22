import { _decorator, Component, Node, Label, Color } from 'cc'
import { GRID_STATUS } from './Framework/Constant'
const { ccclass, property } = _decorator

@ccclass('NodeGrid')
export class NodeGrid extends Component {
  @property(Node)
  MouseSelect: Node = null
  @property(Node)
  DeleteSelect: Node = null
  @property(Label)
  labelWord: Label = null
  @property(Node)
  RemoveSelect: Node = null

  private _status: GRID_STATUS = GRID_STATUS.EMPTY
  private _wordNums: number = 0

  start() {
    this._status = GRID_STATUS.EMPTY
  }

  changeMouseSelect(INFlag: boolean) {
    if (INFlag) {
      ++this._wordNums
    } else {
      --this._wordNums
    }
    if (this._wordNums <= 0 && !INFlag) {
      this.MouseSelect.active = false
    } else {
      this.MouseSelect.active = true
    }
  }

  changeDeleteSelect(INFlag: boolean) {
    this.DeleteSelect.active = INFlag
  }
  setLabelInfo(INWord: string) {
    this.labelWord.string = INWord
    if (INWord === '') {
      this._status = GRID_STATUS.EMPTY
    } else {
      this._status = GRID_STATUS.HAS_CHAR
    }
  }
  /**
   *  返回单元网格内文字
   * @returns string
   */
  getLabelInfo() {
    return this.labelWord.string
  }
  /**
   * 删词功能
   */
  deleteWord() {
    --this._wordNums
    if (this._wordNums > 0) {
      return
    }
    this.resetGridItem()
  }
  recoverChar() {
    console.log('recover inside')
    this.RemoveSelect.active = false
    this._status = GRID_STATUS.HAS_CHAR
  }
  /**
   * 移除字符
   */
  removeChar() {
    this.RemoveSelect.active = true
    this._status = GRID_STATUS.REMOVE_CHAR
  }
  /**
   * 重置
   */
  resetGridItem() {
    this.RemoveSelect.active = false
    this.MouseSelect.active = false
    this.DeleteSelect.active = false
    this._wordNums = 0
    this.labelWord.string = ''
  }
  getGridItemStatus() {
    return this._status
  }
}

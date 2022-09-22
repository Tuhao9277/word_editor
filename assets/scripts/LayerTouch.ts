import {
  _decorator,
  Component,
  Node,
  Event,
  EventTouch,
  UITransform,
  v3,
} from 'cc'
import { HHelpTool } from './Framework/HHelpTool'
import { NodeGrid } from './NodeGrid'
import WordsLib from './Framework/WordsLib'
const { ccclass, property } = _decorator

@ccclass('LayerTouch')
export class LayerTouch extends Component {
  private _isPress: boolean = false
  private _curTouchIndexList: any[] = [] // 当前触摸的索引的列表
  private _isRightSelect: boolean = false // 是否选择的正确

  start() {
    this.registetTouchListener()
  }
  onDestroy() {
    this.removeTouchListener()
  }
  registetTouchListener() {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
  }
  removeTouchListener() {
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
    this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
  }
  /**
   * 触摸开始
   * @param event
   */
  onTouchStart(event) {
    this._isPress = false
    this._isRightSelect = false
    this._curTouchIndexList = []
  }
  /**
   * 触摸移动
   * @param event
   */
  onTouchMove(event: EventTouch) {
    let localPos = this.node
      .getComponent(UITransform)
      .convertToNodeSpaceAR(v3(event.getLocation().x, event.getLocation().y, 0))
    // 转换为点坐标
    let hIndex = Math.abs(Math.floor(localPos.x / 80))
    let vIndex = Math.abs(Math.floor(localPos.y / 80)) - 1
    let oneDimension = hIndex + vIndex * 9
    // 从左到右，从上到下的位置
    /**
     * [ 0 ....,8,
     *
     *
     *          80 ]
     */
    console.log({ hIndex, vIndex, localPos })
    this.insertToList(oneDimension)
  }
  /**
   * 插入位置
   * @param oneDimension
   */
  insertToList(oneDimension: number) {
    if (this._curTouchIndexList.indexOf(oneDimension) === -1) {
      this._curTouchIndexList.push(oneDimension)
    }
  }

  /**
   * 触控离开
   * @param event
   */
  onTouchEnd(event: EventTouch) {
    if (this._curTouchIndexList.length >= 4) {
      this._curTouchIndexList = this._curTouchIndexList.slice(0, 4)
      let isH = HHelpTool.isEnouthH(this._curTouchIndexList.slice(0))
      let isV = HHelpTool.isEnoughV(this._curTouchIndexList.slice(0))
      // 如果符合连续
      if (isH || isV) {
        this.showWord()
      } else {
        this.showAndHide()
      }
    }
  }
  /**
   * 取出，设置一个成语
   */

  showWord() {
    this.recordNodeWords()
    window.async.series([
      (cb) => {
        this.changeMouseSelect(cb)
      },
      (cb) => {
        this.showCurWord()
      },
    ])
  }
  showCurWord() {
    console.log('show cur Words')
    let newWords = WordsLib.findOneWord(window.app.getWordsData().getLastWord())
    // 如果有成语可以写入
    if (!newWords) {
      let lastWordList = window.app.getWordsData().getAndDeleteLastWord()
      this.scheduleOnce(() => {
        // 设置完，取消选中
        this.changeMouseSelect(null, false)
      }, 1)
      return
    }
    // 写入
    for (let i = 0; i < this._curTouchIndexList.length; i++) {
      this.node.children[this._curTouchIndexList[i]]
        .getComponent(NodeGrid)
        .setLabelInfo(newWords[i])
    }
  }
  /**
   * 不满足，也亮一下
   */
  showAndHide() {
    window.async.series([
      (cb) => {
        this.changeMouseSelect(cb)
      },
      (cb) => {
        this.scheduleOnce(() => {
          this.changeMouseSelect(cb, false)
        }, 1)
      },
    ])
  }
  changeMouseSelect(
    cb: (err?: Error, result?: unknown) => void,
    InFlag: boolean = true,
  ) {
    for (let i = 0; i < this._curTouchIndexList.length; i++) {
      const element = this._curTouchIndexList[i]
      this.node.children[element]
        .getComponent(NodeGrid)
        .changeMouseSelect(InFlag)
    }
    cb?.()
  }
  /**
   * 记录滑动单元格的内容
   */
  recordNodeWords() {
    let curAllNodes: any[] = []
    for (let i = 0; i < this._curTouchIndexList.length; i++) {
      const element = this._curTouchIndexList[i]
      curAllNodes.push(this.node.children[element])
    }
    // 滑动选中的NodeGrid存入WordsData
    window.app.getWordsData().pushWord(curAllNodes as NodeGrid[])
  }
}

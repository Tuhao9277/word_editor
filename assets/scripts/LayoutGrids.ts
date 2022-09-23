import { _decorator, Component, Node, Prefab, instantiate } from 'cc'
import { GRID_STATUS } from './Framework/Constant'
import { NodeGrid } from './NodeGrid'
const { ccclass, property } = _decorator

@ccclass('LayoutGrids')
export class LayoutGrids extends Component {
  @property(Prefab)
  prefabGrid: Prefab = null

  start() {
    this.initUI()
  }
  initUI() {
    for (let i = 0; i < 81; i++) {
      const newNode = instantiate(this.prefabGrid)
      newNode.parent = this.node
    }
  }
  clearAllGrids() {
    for (let i = 0; i < this.node.children.length; i++) {
      const curNode = this.node.children[i]
      const curComponent = curNode.getComponent('NodeGrid') as NodeGrid
      curComponent.resetGridItem()
    }
  }
  getAllWords() {
    const res = {
      answer: [],
      idiom: [],
      word: [],
      position: [],
    }
    const totalWords = window.app.getWordsData().getAllWords()
    totalWords.forEach((item) => {
      const itemWord = item
        .map((nodeGrid) => nodeGrid.getComponent(NodeGrid).getLabelInfo())
        .join('')
      res.idiom.push(itemWord)
    })
    for (let i = 0; i < this.node.children.length; i++) {
      const curNode = this.node.children[i]
      const curComponent = curNode.getComponent('NodeGrid') as NodeGrid
      const curStauts = curComponent.getGridItemStatus()
      const info = curComponent.getLabelInfo()
      if (curStauts === GRID_STATUS.EMPTY || !info) {
        continue
      } else if (curStauts === GRID_STATUS.REMOVE_CHAR) {
        res.answer.push(i)
        // 答案
      }
      res.word.push(info)
      res.position.push(i)
    }
    return res
  }
  deleteLastWord() {
    let lastWordList = window.app.getWordsData().getAndDeleteLastWord()
    if (!lastWordList) {
      return
    }
    for (let i = 0; i < lastWordList.length; i++) {
      const curWord = lastWordList[i]?.getComponent('NodeGrid') as NodeGrid
      curWord?.deleteWord()
    }
  }
}

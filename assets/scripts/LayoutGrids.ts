import { _decorator, Component, Node, Prefab, instantiate } from 'cc'
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

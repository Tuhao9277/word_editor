import { Words } from '../../configs/words'
import { Word1 } from '../../configs/word1'
import { Word2 } from '../../configs/word2'
import { Word3 } from '../../configs/word3'
import { Word4 } from '../../configs/word4'
import { NodeGrid } from '../NodeGrid'
import { intersection } from 'lodash-es'

class WordsManager {
  public static readonly Instance = new WordsManager()
  constructor() {
    // this.fs = require("fs");
    this._initWordsList()
  }

  private _allWordsList: string[] = []

  private _wordList1: any = []
  private _wordList2: any = []
  private _wordList3: any = []
  private _wordList4: any = []

  private _curRandList: any[] = []
  private _initWordsList() {
    this._allWordsList = Words
    this._wordList1 = this._getWordIndexs(Word1)
    this._wordList2 = this._getWordIndexs(Word2)
    this._wordList3 = this._getWordIndexs(Word3)
    this._wordList4 = this._getWordIndexs(Word4)
  }
  private _getWordIndexs(InSrc: { key: string; indexs: number[] }[]): any[] {
    let des = []
    for (const i in InSrc) {
      if (Object.prototype.hasOwnProperty.call(InSrc, i)) {
        const element = InSrc[i]
        des[element['key']] = InSrc[i]['indexs']
      }
    }
    return des
  }
  public findOneWord(INWordsList: NodeGrid[]): string {
    this._curRandList = []
    this._curRandList = this._getRandList(INWordsList)
    return this._randomValue()
  }
  _getRandList(INWordsList: NodeGrid[]): any {
    let strList: string[] = []
    let rtn = true
    for (let i = 0; i < INWordsList.length; i++) {
      const curNode = INWordsList[i]
      let labelInfo = curNode.getComponent(NodeGrid).getLabelInfo()
      // 检查有没有填入过信息
      if (labelInfo != '') {
        strList.push(labelInfo)
        rtn = false
      } else {
        strList.push('')
      }
    }
    // 如果没有填入，从大组里找
    if (rtn) {
      return this._allWordsList
      // 如果填入了，去匹配
    } else {
      return this._calNewRandList(strList)
    }
  }
  private _calNewRandList(INStrList: string[]): any {
    let allRandList: any[] = []
    allRandList.push(this._wordList1[INStrList[0]]) // 第1个字  INStrList[i] 可能为''
    allRandList.push(this._wordList2[INStrList[1]]) // 第2个字
    allRandList.push(this._wordList3[INStrList[2]]) // 第3个字
    allRandList.push(this._wordList4[INStrList[3]]) // 第4个字

    // 如果三个空， 返回有字的索引对应的成语
    let final = allRandList.filter((item) => item) // final => [ [1,2,3] ]
    // 如果只有一个字
    if (final.length === 1) {
      return final[0].map((item) => this._allWordsList[item])
    } else {
      // 如果两个或者一个空，两两相比，得出交叉的索引 [[1,2,3],[1,2]]
      return final
        .reduce((prev, cur) => {
          prev = this._calTwoUnion(cur, prev)
          return prev
        }, [])
        .map((item: number) => this._allWordsList[item])
    }
  }
  /**
   * 取交集
   * @param INSet1
   * @param INSet2
   * @returns
   */
  private _calTwoUnion(INSet1: number[], INSet2: number[]) {
    return intersection(INSet1, INSet2)
  }

  _randomValue(): string {
    if (!this._curRandList) {
      return null
    }
    let randValue = Math.floor(Math.random() * this._curRandList.length)
    return this._curRandList[randValue]
  }
}
export default WordsManager.Instance

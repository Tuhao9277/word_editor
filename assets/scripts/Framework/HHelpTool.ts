import { log, sys } from "cc"

export class HHelpTool {
  /**
   * 是否满足行，默认连续，行方向上，每行数 / 9 后同一值
   * 如果行不连续，那么传来的四个点，必有至少两个 / 9 后不相等
   * @param INLengthList
   * @returns
   */
  public static isEnouthH(INLengthList: number[]) {
    for (let i = 0; i < INLengthList.length; i++) {
      INLengthList[i] = Math.floor(INLengthList[i] / 9)
    }
    return this.isAllEqual(INLengthList)
  }
  /**
   * 是否满足列，默认连续，列方向上，每列数 %9 后同一值
   * 如果列不连续，那么传来的四个点，必有至少两个 % 9 后不相等
   *
   * @param INLengthList
   */
  public static isEnoughV(INLengthList: number[]) {
    for (let i = 0; i < INLengthList.length; i++) {
      INLengthList[i] = Math.floor(INLengthList[i] % 9)
    }
    return this.isAllEqual(INLengthList)
  }
  /**
   * 判断是否存在不同的值
   * @param INLengthList
   */
  public static isAllEqual(INLengthList: any) {
    let minValue = 100
    let maxValue = -1
    for (let i = 0; i < INLengthList.length; i++) {
      const element = INLengthList[i]
      minValue = Math.min(element, minValue)
      maxValue = Math.max(element, maxValue)
    }
    return minValue === maxValue
  }
  public static creatJosnFile(data: any, fileName: string) {
    var content = JSON.stringify(data)
    this.saveForBrowser(content, fileName)
  }
  /**
   * 存字符串内容到文件。
   * @param textToWrite  - 要保存的文件内容
   * @param fileNameToSaveAs - 要保存的文件名
   */
  public static saveForBrowser(textToWrite, fileNameToSaveAs) {
    if (sys.isBrowser) {
      log('浏览器')
      let textFileAsBlob = new Blob([textToWrite], { type: 'application/json' })
      let downloadLink = document.createElement('a')
      downloadLink.download = fileNameToSaveAs
      downloadLink.innerHTML = 'Download File'
      if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
      }
      downloadLink.click()
    }
  }
}

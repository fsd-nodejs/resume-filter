const fs = require('fs')
const PDFParser = require('pdf2json')

/**
 * 转换pdf为txt
 * @param {string} path pdf文件路径
 */
const pdf2Txt = function (path) {
  const pdfParser = new PDFParser(this, 1)
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, pdfBuffer) => {
      if (!err) {
        pdfParser.parseBuffer(pdfBuffer);

        pdfParser.on('pdfParser_dataError', (errData) => {
          console.error(errData.parserError)
          reject(errData.parserError)
        })
        pdfParser.on('pdfParser_dataReady', (pdfData) => {
          data = pdfParser.getRawTextContent()
          resolve(data)
        })
      }
    })
  })
}

exports.pdf2Txt = pdf2Txt

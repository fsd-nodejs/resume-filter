const fs = require('fs')
const path = require('path')
const { pdf2Txt } = require('./pdf2txt')

/**
 * 读取目录下的文件
 * @param {*} resumeDir 简历所在目录
 */
const readDir = function (resumeDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, resumeDir), function (err, files) {
      const dirs = []
      ;(function iterator(i) {
        if (i == files.length) {
          // console.log(dirs);
          resolve(dirs)
          return
        }
        fs.stat(
          path.join(__dirname, resumeDir, files[i]),
          function (err, data) {
            if (data.isFile()) {
              dirs.push(path.join(__dirname, resumeDir, files[i]))
            }
            iterator(i + 1)
          }
        )
      })(0)
    })
  })
}

/**
 * 提取简历所有的内容
 * @param {*} dirs 文件路径数组
 * @param {*} keywords 识别关键字数组
 */
const readResume = function (dirs, keywords) {
  return new Promise((resolve) => {
    let resumes = []
    let max = keywords.reduce((prev, curr) => {
      return prev + curr.weight
    }, 0)
    ;(function iterator(i) {
      if (i == dirs.length) {
        resolve(resumes)
        return
      }
      pdf2Txt(dirs[i]).then((data) => {
        let weight = 0
        keywords.map((item) => {
          if (data.indexOf(item.key) >= 0) {
            weight += item.weight
          }
        })
        resumes.push({
          name: dirs[i].split('.pdf')[0].split('resume/')[1],
          path: dirs[i],
          weight,
          match: ((weight / max) * 100).toFixed(2) + '%',
          getContent: () => {
            const d = data
            return d
          },
        })
        iterator(i + 1)
      })
    })(0)
  })
}

/**
 * 提取简历内容
 * @param {*} resumeDir 简历所在目录(相对路径)
 * @param {*} keywords 简历筛选关键词
 */
const main = async (resumeDir, keywords) => {
  const dirs = await readDir(resumeDir)
  const resumes = await readResume(
    dirs.filter((item) => item.indexOf('pdf') > 0),
    keywords
  )
  console.log('内容提取完成')
  return resumes
}

exports.main = main

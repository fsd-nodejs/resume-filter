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
        // 匹配关键字
        keywords.map((item) => {
          if (data.indexOf(item.key) >= 0) {
            weight += item.weight
          }
        })
        const information = {
          email: data.match(/[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g), // 邮箱检测
          phone: data.match(
            /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g
          ), // 手机检测
          website: data.match(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g), // 个人网站或者github.com检测
          project: data.match(/项目经历|项目经验/g), // 项目经历检测
          work: data.match(/工作经历/g), // 工作经历检测
          education: data.match(/教育经历/g), // 教育经历检测
          age: data.match(/[\d+]{1,2}岁|出生年月/g), // 年龄检测
          years: data.match(/[\d+]{1,2}年/g) // 工作年限检测
        }
        resumes.push({
          name: dirs[i].split('.pdf')[0].split('resume/')[1],
          path: dirs[i],
          weight,
          match: ((weight / max) * 100).toFixed(2) + '%',
          integrity:
            (
              (Object.values(information).filter((item) => !!item).length /
                Object.keys(information).length) *
              100
            ).toFixed(2) + '%',
          getContent: () => {
            const d = data
            return d
          },
          getInformation: () => {
            const d = information
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

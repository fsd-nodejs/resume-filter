const transform = require('./transform')
const path = require('path')
const resumeDir = './resume' // 文章所在目录

const keywords = [
  'github',
  'React',
  'react',
  'node.js',
  'mysql',
  '热爱技术',
  '小程序',
]
// 前端工程师筛选关键词

const main = async () => {
  // 提取简历内容
  const resumes = await transform.main(resumeDir, keywords)
  console.log(resumes)
}

main()

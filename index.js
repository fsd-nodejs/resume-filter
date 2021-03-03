const transform = require('./transform')
const path = require('path')
const resumeDir = './resume' // 文章所在目录

const keywords = [
  { key: 'github', weight: 10 },
  { key: 'React', weight: 1 },
  { key: 'react', weight: 1 },
  { key: 'node.js', weight: 1 },
  { key: 'mysql', weight: 1 },
  { key: '热爱技术', weight: 1 },
  { key: '小程序', weight: 1 },
]
// 前端工程师筛选关键词

const main = async () => {
  // 提取简历内容
  const resumes = await transform.main(resumeDir, keywords)
  console.log(resumes.sort((x, y) => y.weight - x.weight))
}

main()

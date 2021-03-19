const transform = require('./transform')
const resumeDir = './resume' // 简历所在目录

// 前端工程师筛选关键词(React、小程序)
const keywords = [
  { key: 'github.com', weight: 10 },
  { key: 'React', weight: 3 },
  { key: '小程序', weight: 3 },
  { key: 'Node.js', weight: 1 },
  { key: '热爱技术', weight: 1 },
  { key: '@gmail', weight: 3 },
  { key: '本科', weight: 2 },
  { key: '大专', weight: 1 },
  { key: 'CSRF', weight: 1 },
  { key: 'XSS', weight: 1 },
]

const main = async () => {
  // 提取简历内容
  const resumes = await transform.main(resumeDir, keywords)
  console.log(resumes.sort((x, y) => y.weight - x.weight))
}

main()

//帮我们后处理 css 的,加浏览器的 兼容属性

const autoprefixer = require('autoprefixer')

module.exports = {
    plugins:[
        autoprefixer()
    ]
}
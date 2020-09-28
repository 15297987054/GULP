const gulp = require('gulp')
const $ = require('gulp-load-plugins') // 以下的插件使用的时候都可以用 $.插件名 替代
const htmlmin = require('gulp-htmlmin') // $.htmlmin
const fileinclude = require('gulp-file-include') // $.fileInclude
const less = require('gulp-less') // $.less
const csso = require('gulp-csso') // $.csso
const babel = require('gulp-babel') // $.babel
const uglify = require('gulp-uglify') // $.uglify
const concat = require('gulp-concat') // $.concat
const rename = require('gulp-rename') // $.rename
const cssClean = require('gulp-clean-css') // $.cleanCss
const liveReload = require('gulp-livereload') // $.livereload
const connect = require('gulp-connect') // $.connect
const open = require('open') // $.open

gulp.task('first', async()=>{
    return  await gulp.src('./src/css/index.css')
    .pipe(gulp.dest('dist/css'))
})
//html任务
//插件 npm i gulp-htmlmin
//1.html文件中代码压缩操作
//插件 npm i gulp-file-include
//2.抽取html文件中的公共代码
gulp.task('htmlmin',()=>{
    return  gulp.src('./src/*.html')
    //抽取公共代码 将多个html中的相同代码抽出放到另一个路径下的html
    // 文件中，在html中引入即可：@@include('公共代码路径')
    .pipe(fileinclude())
    //压缩html文件中的代码
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(liveReload()) //实时刷新，热重载
    .pipe(connect.reload()) // 实时刷新
    .pipe(gulp.dest('dist'))
   
})

//css任务
// 插件 npm i gulp-less
//1.less语法转换
// 插件 npm i gulp-csso 
//2.css代码压缩
gulp.task('cssmin',()=>{
    return  gulp.src(['./src/css/*.less','./src/css/*.css'])
    //将less语法转换为css语法
    .pipe(less())
    //将less语法进行压缩
    .pipe(csso())
    //兼容处理
    .pipe(cssClean({compatibility:'ie7'}))
    .pipe(liveReload()) //实时刷新，热重载
    .pipe(connect.reload()) // 实时刷新
    .pipe(gulp.dest('dist/css'))
})

//js任务
// 插件 npm i gulp-babel @babel/core @babel/preset-env
//1.js代码兼容浏览器
// 插件 npm i gulp-uglify
//2.代码压缩
gulp.task('jsmin',()=>{
     // 加了return 表示这个任务是异步的，不加则为同步，
    // 同步时：任务按顺序执行，前一个执行完了，再执行下一个。异步时：所有任务同时启动，同时执行，完成顺序看任务量的大小
    return  gulp.src('./src/js/*.js')
    .pipe(concat('build.js')) //临时合并文件
    .pipe(babel({
        //它可以判断当前代码运行环境，将代码转换为当前运行环境所支持的代码
        presets:['@babel/env']
    }))
    .pipe(uglify())
    .pipe(rename({suffix:'.min'}))//重命名
    .pipe(liveReload()) //实时刷新
    .pipe(connect.reload()) // 实时刷新
    .pipe(gulp.dest('dist/js'))
})

//复制文件夹
gulp.task('copy',()=>{
   
    gulp.src('./src/images/*')
    .pipe(gulp.dest('dist/images'))
    gulp.src('./src/lib/*')
    .pipe(gulp.dest('dist/lib'))
})


// 构建任务
// 此处执行失败 Task function must be specified 老师的可以，我的不行，尚不知原因
gulp.task('default', ['htmlmin','cssmin','jsmin','copy'])

//监视任务(半自动)
gulp.task('watch',['default'],()=>{
    // 开启监听
    liveReload.listen()
    //确认监听的目标以及绑定相应的任务,监听中的文件改变了，就会自动执行相应的任务
    gulp.watch('src/js/*.js',['jsmin'])
    gulp.watch(['src/css/*.css','src/less/*.less'],['cssmin'])
})

// 监视任务(全自动)
gulp.task('server',['default'],()=>{
    //配置服务器的选项
    connect.server({
        root:'dist/',
        livereload:true,//实时刷新
        port:8000,
    })
     //确认监听的目标以及绑定相应的任务,监听中的文件改变了，就会自动执行相应的任务
     gulp.watch('src/js/*.js',['jsmin'])
     gulp.watch(['src/css/*.css','src/less/*.less'],['cssmin'])
})

open('http://localhost:8000/')
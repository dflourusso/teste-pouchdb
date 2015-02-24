gulp = require 'gulp'
es = require 'event-stream'
tpl = require 'gulp-angular-templatecache'
order = require 'gulp-order'
concat  = require 'gulp-concat'
coffee  = require 'gulp-coffee'
plumber = require 'gulp-plumber'
connect = require 'gulp-connect'
ngClassify = require 'gulp-ng-classify'

uglify = require 'gulp-uglify'

less          = require 'gulp-less'
sourcemaps    = require 'gulp-sourcemaps'
minifyCSS     = require 'gulp-minify-css'
notify        = require 'gulp-notify'
gutil         = require 'gulp-util'
autoprefixer  = require 'gulp-autoprefixer'

gulp.task 'build', ->
  js =
    gulp.src 'src/**/*.coffee'
    .pipe plumber()
    .pipe ngClassify(appName: 'teste-daniel')
    .pipe concat('teste-daniel.js')
    .pipe coffee(bare: no)

  tplCache =
    gulp.src 'src/partials/**/*.html'
    .pipe tpl(module: 'teste-daniel')

  es.merge(tplCache, js)
    .pipe order(['teste-daniel.js', 'template.js']) # precisa para colocar o template no final do arquivo
    .pipe concat('teste-daniel.js')
    .pipe gulp.dest 'dist/js'
    .pipe(uglify())
    .pipe(concat('teste-daniel.min.js'))
    .pipe(gulp.dest('dist/js'))

gulp.task 'examples', ->
  gulp.src 'examples/**/*.coffee'
  .pipe plumber()
  .pipe ngClassify(appName: 'teste-daniel-examples')
  .pipe coffee(bare: no)
  .pipe(gulp.dest("examples"))

gulp.task 'server', ->
  connect.server(root: '.')

gulp.task "less", ->
  gulp.src("src/less/**/*.less")
  .pipe(sourcemaps.init())
  .pipe(less().on('error', gutil.log))
  .pipe(autoprefixer())
  .pipe(concat('teste-daniel.css'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("dist/css"))

gulp.task "min-css", ->
  gulp.src("src/less/**/*.less")
  .pipe(sourcemaps.init())
  .pipe(less().on('error', gutil.log))
  .pipe(autoprefixer())
  .pipe(concat('teste-daniel.css'))
  .pipe(minifyCSS({keepBreaks: false}))
  .pipe(concat('teste-daniel.min.css'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("dist/css"))

gulp.task 'watch', ->
  gulp.watch 'src/**/*', ['build', 'min-css', 'less']
  gulp.watch 'examples/**/*.coffee', ['examples']

gulp.task 'default', ['build', 'min-css', 'less', 'examples']

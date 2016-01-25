var gulp=require('gulp'),
	connect=require('gulp-connect'),
	browserify=require('gulp-browserify'),
	concat=require('gulp-concat'),
	port=process.env.port||5000;
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
//编译js
gulp.task('browserify',function(){
	gulp.src('./app/js/main.js')
		.pipe(browserify({
			transform:'reactify'
		}))
		.pipe(gulp.dest('./dist/js'));
});

//开启服务器
gulp.task('connect',function(){
	connect.server({
		root:'./',
		port:port,
		livereload:true
	});
});

//刷新js，html
gulp.task('js',function(){
	gulp.src('./dist/**/*.js')
		.pipe(connect.reload());
})
gulp.task('html',function(){
	gulp.src('./app/**/*.html')
		.pipe(connect.reload());
});

//监察
gulp.task('watch',function(){
	gulp.watch('./dist/**/*.js',['js']);
	gulp.watch('./app/js/**/*.js',['browserify']);
	gulp.watch('./app/**/*.html',['html']);
});

//压缩
gulp.task('min',function(){
	gulp.src('./dist/js/main.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('default',['browserify']);
gulp.task('server',['browserify','connect','watch']);
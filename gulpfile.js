var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		plumber		 = require('gulp-plumber'),
		critical 	= require('critical');



// Скрипты проекта

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.js'))
	// .pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('scripts', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery-3.3.1/jquery-3.3.1.min.js',
        // 'app/libs/PagePiling/jquery.pagepiling.min.js',
        'app/libs/slick-1.8.1/slick/slick.min.js'
		// //datepicker scripts
		// 'app/libs/air-datepicker/dist/js/datepicker.min.js',
		// 'app/libs/datepicker/datepicker.en.js',
		// //datepicker end
		// 'app/libs/slick-1.8.1/slick/slick.min.js',
		// 'app/libs/magnific-popup/jquery.magnific-popup.min.js',
		// 'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});



// gulp.task( 'sass', function()
// {
//   gulp.src( 'sass/styles.scss' )
//     .pipe( sass().on( 'error', notify.onError(
//       {
//         message: "<%= error.message %>",
//         title  : "Sass Error!"
//       } ) )
//   )
//     .pipe( gulp.dest( 'css/' ) )
//     .pipe( notify( 'SASS - хорошая работа!' ) );
// } );


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// gulp.task('sass', function() {
// 	return gulp.src('app/sass/**/*.sass')
// 	.pipe(sass().on("error", notify.onError()))
// 	// .pipe(rename({suffix: '.min', prefix : ''}))
// 	.pipe(autoprefixer(['last 15 versions']))
// 	// .pipe(cleanCSS())
// 	.pipe(gulp.dest('app/css'))
// 	.pipe(browserSync.reload({stream: true}));
// });
gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(plumber())
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('watch', ['sass', 'scripts', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.css',
		])
        .pipe(plumber())
        .pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		])
        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});


gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);

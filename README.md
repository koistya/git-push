# git-push

[![NPM version](http://img.shields.io/npm/v/git-push.svg?style=flat-square)](https://www.npmjs.com/package/git-push)
[![NPM downloads](http://img.shields.io/npm/dm/git-push.svg?style=flat-square)](https://www.npmjs.com/package/git-push)
[![Build Status](http://img.shields.io/travis/koistya/git-push/master.svg?style=flat-square)](https://travis-ci.org/koistya/git-push)
[![Dependency Status](http://img.shields.io/david/koistya/git-push.svg?style=flat-square)](https://david-dm.org/koistya/git-push)
[![Tips](http://img.shields.io/gratipay/koistya.svg?style=flat-square)](https://gratipay.com/koistya)
[![Discussion](http://img.shields.io/badge/discussion-join!-blue.svg?style=flat-square)](https://github.com/koistya/git-push/issues/2)

> Use [git-push](https://github.com/koistya/git-push) to deploy your website to
> [Azure](http://azure.microsoft.com/services/app-service/web/), [Heroku](https://www.heroku.com/),
> [GitHub Pages](https://pages.github.com/) or any other hosting provider
> supporting Git-based deployments.

## Install

```sh
npm install git-push --save-dev
```

### Example 1

```js
// deploy.js

var push = require('git-push');

push('./app', 'http://github.com/example/example.github.io', function() {
  console.log('Done!');
});
```

```sh
$ node deploy.js
```

### Example 2

```js
// gulpfile.js

var gulp = require('gulp');
var del = require('del');
var push = require('git-push');
var argv = require('minimist')(process.argv.slice(2));

gulp.task('clean', del.bind(null, ['build/*', '!build/.git'], {dot: true}));

gulp.task('build', ['clean'], function() {
  // TODO: Build website from source files into the `./build` folder
});

gulp.task('deploy', function(cb) {
  var remote = argv.production ?
    {name: 'production', url: 'http://github.com/user/example.com', branch: 'gh-pages', message: argv.version },
    {name: 'test', url: 'http://github.com/user/test.example.com', branch: 'gh-pages'};
  push('./build', remote, cb);
});
```

```sh
$ gulp build --release
$ gulp deploy --production
```

## API

##### push(sourceDir, remote, callback);

## Reference

 - [Continuous deployment using Git in Azure App Service](http://azure.microsoft.com/documentation/articles/web-sites-publish-source-control/) by Windows Azure
 - [Kudu - the engine behind Git deployments in Azure Web Apps](https://github.com/projectkudu/kudu) by Windows Azure
 - [How To Set Up Automatic Deployment with Git with a VPS](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps) by DigitalOcean
 - [Deploying with Git](https://devcenter.heroku.com/articles/git) by Heroku
 - [Git as a deployment tool](http://gitolite.com/deploy.html) by gitolite

## License

The MIT License © Konstantin Tarkus ([@koistya](https://twitter.com/koistya))

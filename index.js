/**
 * Copyright (c) Konstantin Tarkus (@koistya). All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

function push(sourceDir, remote, cb) {

  if (!path.isAbsolute(sourceDir) && process) {
    sourceDir = path.join(process.cwd(), sourceDir);
  }

  if (typeof remote === 'string') {
    remote = {name: 'origin', url: remote, branch: 'master'};
  }

  remote.branch = remote.branch || 'master';
  remote.name = remote.name || 'origin';

  cb = cb || function() {};

  var options = {cwd: sourceDir, stdio: 'inherit'};
  var message = 'Update ' + new Date().toISOString();

  // Start with an empty promise
  Promise.resolve()

    //
    // Initialize a new Git repository if it doesn't exist
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve, reject) {
        if (!fs.existsSync(path.join(options.cwd, '.git'))) {
          spawn('git', ['init'], options)
            .on('exit', function(code) {
              if (code === 0) {
                resolve();
              } else {
                reject('Failed to initialize a new Git repository.');
              }
            });
        } else {
          resolve();
        }
      });
    })

    //
    // Set a remote repository URL
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve) {
        exec('git config --get remote.' + remote.name + '.url', options,
          function(err, stdout) {
            if (stdout.trim() === '') {
              spawn('git', ['remote', 'add', remote.name, remote.url], options)
                .on('exit', function() {
                  console.log('Add a new remote ' + remote.url + '(' + remote.name + ')');
                  resolve();
                });
            } else if (stdout.trim() !== remote.url) {
              spawn('git', ['remote', 'set-url', remote.name, remote.url], options)
                .on('exit', function() {
                  console.log('Set \'' + remote.name + '\' remote to ' + remote.url);
                  resolve();
                });
            } else {
              resolve();
            }
          }
        );
      });
    })

    //
    // Check if target branch exists
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve) {
        exec('git ls-remote ' + remote.name + ' ' + remote.branch, options,
          function(err, stdout) {
            if (stdout.trim() === '') {
              spawn('git', ['add', '.'], options)
                .on('exit', function() {
                  spawn('git', ['commit', '-m', message], options)
                    .on('exit', function() {
                      spawn('git', ['push', remote.name, 'master'], options)
                        .on('exit', function() {
                          cb();
                        });
                    });
                });
            } else {
              resolve();
            }
          }
        );
      });
    })

    //
    // Fetch the content of the remote repository
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve, reject) {
        console.log('Fetching remote repository...');
        spawn('git', ['fetch', remote.name], options)
          .on('exit', function(code) {
            if (code === 0) {
              resolve();
            } else {
              reject('Failed to fetch the remote repository ' + remote.url);
            }
          });
      });
    })

    //
    // Reset the local branch to the remote one
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve, reject) {
        var commit = remote.name + '/' + remote.branch;
        spawn('git', ['reset', '--soft', commit], options)
          .on('exit', function(code) {
            if (code === 0) {
              resolve();
            } else {
              reject('Failed to reset the local branch to ' + commit + '.');
            }
          });
      });
    })

    //
    // Add new/modified/deleted files to staging area
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve, reject) {
        console.log('Adding files to staging area...');
        spawn('git', ['add', '--all', '.'], options)
          .on('exit', function(code) {
            if (code === 0) {
              resolve();
            } else {
              reject();
            }
          });
      });
    })

    //
    // Create a new commit
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve, reject) {
        console.log('Creating a new commit...');
        spawn('git', ['commit', '-m', message], options)
          .on('exit', function(code) {
            if (code === 0) {
              resolve();
            } else {
              reject();
            }
          });
      });
    })

    //
    // Push to remote
    // -------------------------------------------------------------------------
    .then(function() {
      return new Promise(function(resolve, reject) {
        console.log('Pushing to ' + remote.url);
        spawn('git', ['push', remote.name, 'master'], options)
          .on('exit', function(code) {
            if (code === 0) {
              cb();
            } else {
              reject();
            }
          });
      });
    })

    //
    // Catch errors
    // -------------------------------------------------------------------------
    .catch(function(err) {
      cb(err || 'Failed to push the contents.');
    });
}

module.exports = push;

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var defaults = require('./conf.json');

function FolderTree (root, userConf) {
  this.conf = typeof userConf !== 'undefined' ? userConf : defaults;

  this.path = path.resolve(root);
  this.files = [];
  this.folders = [];

  // Initialize folder tree
  this.readContents();
}

FolderTree.prototype.readContents = function () {
  var self = this;
  var root = this.path;
  var contents = fs.readdirSync(root);
  var paths;
  var folders;
  var allowedFolders;
  var files;

  paths = contents.map(function join (f) {
    return path.join(root, f);
  });

  // filter for directories
  folders = paths.filter(function pathsFilter (item) {
    return fs.statSync(item).isDirectory();
  });

  // filter for allowed folders
  if (self.conf.ignore_folders) {
    allowedFolders = folders.filter(function foldersFilter (folder) {
      return self.conf.ignore_folders.indexOf(path.basename(folder)) === -1;
    });
  }

  // Filter files
  files = paths
    .filter(function filesFilter (item) {
      return fs.statSync(item).isFile();
    })
    .map(path.basename); // use only basename

  // ignore files by pattern
  if (self.conf.ignore_file_patterns) {
    self.conf.ignore_file_patterns.forEach(function eachPattern (pattern) {
      files = files.filter(function filesPatternFilter (file) {
        return !file.match(new RegExp(pattern));
      });
    });
  }

  // store files
  this.files = files;

  // store folders
  this.folders = (allowedFolders ? allowedFolders : folders).map(function allowedFoldersMap (folder) {
    var subfolder = new FolderTree(folder, self.conf);
    subfolder.parent = self;

    return subfolder;
  });
};

FolderTree.prototype.updateConf = function (newConf) {
  Object
    .keys(newConf)
    .forEach(function eachKey (key) {
      this.conf[key] = newConf[key];
    }.bind(this));
};

module.exports = FolderTree;

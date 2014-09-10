var fs = require('fs')
  , path = require('path')
  , _ = require('lodash')
  , defaults = require('./conf.json')

function FolderTree (root, _conf) {
  this.conf = typeof _conf !== 'undefined' ? _conf : defaults

  this.path = path.resolve(root)
  this.files = []
  this.folders = []

  // Initialize folder tree
  this.readContents()
}

FolderTree.prototype.readContents = function () {
  var parent = this
    , root = this.path
    , contents = fs.readdirSync(root)
    , paths
    , folders
    , allowedFolders
    , files

  paths = contents.map(function join (f) {
    return path.join(root, f)
  })

  // filter for directories
  folders = paths.filter(function pathsFilter (item) {
    return fs.statSync(item).isDirectory()
  })

  // filter for allowed folders
  if (parent.conf.ignore_folders) {
    allowedFolders = folders.filter(function foldersFilter (folder) {
      return parent.conf.ignore_folders.indexOf(path.basename(folder)) === -1
    })
  }

  // Filter files
  files = paths
    .filter(function filesFilter (item) {
      return fs.statSync(item).isFile()
    })
    .map(path.basename) // use only basename

  // ignore files by pattern
  if (parent.conf.ignore_file_patterns) {
    parent.conf.ignore_file_patterns.forEach(function eachPattern (pattern) {
      files = files.filter(function filesPatternFilter (file) {
        return !file.match(new RegExp(pattern))
      })
    })
  }

  // store files
  this.files = files

  // store folders
  this.folders = (allowedFolders ? allowedFolders : folders).map(function allowedFoldersMap (folder) {
    var subfolder = new FolderTree(folder, parent.conf)
    subfolder.parent = parent

    return subfolder
  })
}

module.exports = FolderTree

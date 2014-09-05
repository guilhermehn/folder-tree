var fs = require('fs')
  , path = require('path')
  , _ = require('lodash')
  , defaults = require('./conf.json')
  , conf

function FolderTree (root, _conf) {
  conf = _conf ? conf : defaults

  this.path = path.resolve(root)
  this.files = []
  this.folders = []

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
  allowedFolders = folders.filter(function foldersFilter (folder) {
    return config.ignore_folders.indexOf(path.basename(folder)) === -1
  })

  // Filter files
  files = paths
    .filter(function filesFilter (item) {
      return fs.statSync(item).isFile()
    })
    .map(path.basename) // use only basename

  // ignore files by pattern
  config.ignore_file_patterns.forEach(function eachPattern (pattern) {
    files = files.filter(function filesPatternFilter (file) {
      return !file.match(new RegExp(pattern))
    })
  })

  // store files
  this.files = files

  this.folders = allowedFolders.map(function allowedFoldersMap (folder) {
    var subfolder = new FolderTree(folder)
    subfolder.parent = parent

    return subfolder
  })
}

module.exports = FolderTree

console.log(require('util').inspect(new FolderTree('..'), { depth: null }))

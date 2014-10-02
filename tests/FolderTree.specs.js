var expect = require('chai').expect
  , FolderTree = require('..')

describe('FolderTree', function () {
  var tree = new FolderTree('.')

  it('should identify contained files', function () {
    expect(tree.files.length).to.be.equal(5)
  })

  it('should identify contained folders', function () {
    expect(tree.folders.length).to.be.equal(1)
  })

  it('should maintain a reference to the parent folder for each subdirectory', function () {
    expect(tree.folders[0].parent.path).to.be.equal(tree.path)
  })

  it('should accept a options object as argument', function () {
    var tree = new FolderTree('.', { ignore_file_patterns: ['.*\.json$'] })

    expect(tree.files.length).to.be.equal(3)
  })

  describe('#updateConf(object)', function () {
    it('should update the configuration object from the instance', function () {
      var tree = new FolderTree('.')
      tree.updateConf({ ignore_file_patterns: ['.*\.json$'] })
      tree.readContents()

      expect(tree.files.length).to.be.equal(3)
    })
  })
})

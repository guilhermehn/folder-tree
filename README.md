# folder-tree
> Read folder contents recursively

## Install
```npm install folder-tree```

## Usage
```javascript
var FolderTree = require('folder-tree')
  , tree = new FolderTree('.')

util.inspect(tree, { depth: null })
```

### Attention
It (still) ***synchronously*** reads through the folders, don't expect high performance.

## License
MIT

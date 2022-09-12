const {join,relative} = require('path')
const JSZip = require('jszip')
const { file } = require('jszip')
const { RawSource } = require('webpack-sources')
const zip = new JSZip()

function ZipPlugin(options) {
  const defaultOptions = {
    outputPath:'',
    name:'zip',
    ext:'zip',
    pathInZip:'',
    dropRaw:false
  }
  if(options){
    this.options={...defaultOptions,...options}
  }else{
    this.options = defaultOptions
  }
}

ZipPlugin.prototype.apply = function(compiler) {
  const { outputPath, pathInZip, name, ext, dropRaw} = this.options
  const handler = function(compliation,callback){
    for(let filename in compliation.assets){
      const source = compliation.assets[filename].source()
      zip.file(join(pathInZip,filename),source)
      if(dropRaw){
        delete compliation.assets[filename]
      }
    }
    zip.generateAsync({
      type:'nodebuffer'
    }).then(content=>{
      const outputAbsPath = join(compliation.options.output.path,outputPath,`${name}.${ext}`)
      const outputRelativePath = relative(compliation.options.output.path,outputAbsPath)
      compliation.assets[outputRelativePath] = new RawSource(content)
      callback()
    })
  }
  const handlerDelete = function (compliation) {
    
  }
  compiler.hooks.emit.tapAsync(ZipPlugin.name,handler)
}
module.exports = ZipPlugin;
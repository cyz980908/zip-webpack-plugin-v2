const {join} = require('path')
const {readFileSync}  = require('fs')
const webpack = require('webpack')
const ZipPlugin = require('../index.js')
const rimraf = require('rimraf')
const WAIT_TIME = 50000
function randomPath(){
  return join(__dirname,'dist',String(Math.random()).slice(2));
}

function randomName(n) {
  return String(Math.random()).slice(2)
}

function runWithWebpack({path,filename},options){
  return new Promise((res,rej)=>{
    webpack({
      mode:'development',
      entry:join(__dirname,'src','index.js'),
      bail: true,
      output:{
        path,
        filename
      },
      plugins:[
        new ZipPlugin(options)
      ]
    },(err,status)=>{
      status.hasErrors()?rej(status.toString()):res(status)
    })
  })
}
test('basic',async()=>{
  const path = join(__dirname,'dist','basic')
  const filename = `${randomName()}File.js`
  await runWithWebpack({path,filename})
  const bundleZip = readFileSync(join(path,filename))
  await expect(bundleZip).toBeTruthy()
},WAIT_TIME);
test('wgt',async()=>{
  const path = join(__dirname,'dist','wgt')
  const filename = `${randomName()}File.js`
  const options = {
    ext:'wgt'
  }
  await runWithWebpack({path,filename},options)
  const bundleZip = readFileSync(join(path,filename))
  await expect(bundleZip).toBeTruthy()
},WAIT_TIME);
test('dropRaw',async ()=>{
  const path = join(__dirname,'dist','dropRaw')
  const filename = `${randomName()}File.js`
  const options = {
    ext:'wgt',
    dropRaw:true,
    name:'dropRawFile'
  }
  await runWithWebpack({path,filename},options)
  const bundleZip = readFileSync(join(path,`${options.name}.${options.ext}`))
  await expect(bundleZip).toBeTruthy()
},WAIT_TIME);
beforeAll(()=>{
  rimraf.sync(join(__dirname,'dist'))
})
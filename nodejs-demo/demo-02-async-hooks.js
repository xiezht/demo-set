const async_hooks = require('async_hooks')
const fs = require('fs')
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const eid = async_hooks.executionAsyncId();
    fs.writeSync(
      1, `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid} resource: ${Object.keys(resource)}\n`);
  }
}).enable();

require('net').createServer((conn) => {}).listen(8080);

'use strict'

require('colors')

const pushover = require('pushover')
const minimist = require('minimist')

function help (msg) {
  if (msg) console.warn(msg)

  console.log('node index.js [--path] [--port]')
}

function start (path, port) {
  var repos = pushover(path)

  repos.on('push', (push) => {
    console.log('push ' + push.repo + '/' + push.commit
        + ' (' + push.branch + ')'
    )
    push.accept()
  })

  repos.on('fetch', (fetch) => {
    console.log('fetch ' + fetch.repo + '/' + fetch.commit)
    fetch.accept()
  })

  var http = require('http')
  var server = http.createServer(function (req, res) {
    repos.handle(req, res)
  })

  console.log(`Starting server on port: ${port}`.green)
  server.listen(port)
}

function main () {
  const argv = minimist(process.argv.slice(2))
  const { path, port } = argv

  if (argv.help || argv._[0] == 'help') {
    help()
    return
  }

  start(path || '/tmp/repos', port || 7000)
}

main()

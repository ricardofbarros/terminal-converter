var mocha = require('mocha')

var fork = require('child_process').fork

var describe = mocha.describe
var it = mocha.it
var expect = require('chai').expect

describe('Query google converter', function () {
  it('should warn the user for the missing args', function (done) {
    var conv = fork('./bin/conv.js', [], { silent: true })
    var output = []

    conv.stdout.on('data', function (buff) {
      output.push(buff.toString())
    })

    conv.on('close', function () {
      expect(output.join('')).to.contain('You need to query what you want to convert.')
      done()
    })
  })

  it('should find a g-card', function (done) {
    var conv = fork('./bin/conv.js', ['1 l to gal'], { silent: true })
    var output = []

    conv.stdout.on('data', function (buff) {
      output.push(buff.toString())
    })

    conv.on('close', function () {
      expect(output.join('')).to.contain('1 l =')
      done()
    })
  })

  it('shouldn\'t find a g-card', function (done) {
    var conv = fork('./bin/conv.js', ['nothing to convert'], { silent: true })
    var output = []

    conv.stdout.on('data', function (buff) {
      output.push(buff.toString())
    })

    conv.on('close', function () {
      expect(output.join('')).to.contain('Nothing found. Please check your query syntax and try again.')
      done()
    })
  })
})

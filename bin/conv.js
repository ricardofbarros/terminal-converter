#!/usr/bin/env node

var request = require('request')
var zlib = require('zlib')
var cheerio = require('cheerio')

function googleQuery (searchStr, done) {
  if (!searchStr) {
    return render('You need to query what you want to convert.')
  }

  var buffer = []
  var gunzip = zlib.createGunzip()

  gunzip
  .on('data', function (data) {
    buffer.push(data.toString())
  })
  .on('end', function () {
    done(null, buffer.join(''))
  })
  .on('error', function (err) {
    done(err)
  })

  request({
    method: 'GET',
    uri: 'https://www.google.pt/search?q=' + encodeURIComponent(searchStr),
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Host': 'www.google.pt',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:45.0) Gecko/20100101 Firefox/45.0'
    }
  }).pipe(gunzip)
}

googleQuery(process.argv.splice(2).join(' '), function (err, data) {
  if (err) {
    return console.error(err)
  }

  var $ = cheerio.load(data)

  var from = $('g-card .vk_gy').html()
  var to = $('g-card .vk_ans').html()
  var out

  if (!from || !to) {
    out = 'Nothing found. Please check your query syntax and try again.'
  } else {
    out = from + ' ' + to
  }

  return render(out)
})

function render (text) {
  console.log(Array(text.length).join('-'))
  console.log(text)
  console.log(Array(text.length).join('-'))
}

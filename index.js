var request = require('request')
var cheerio = require('cheerio')

var domain = 'https://losangeles.craigslist.org'
var baseUrl = domain + '/search/apa'

module.exports = function (nDesired, cb) {
  const loadPage = (pageNumber, result, callback) => {
    const getUrl = () => {
      if (pageNumber === 0) {
        return baseUrl
      } else {
        return `${baseUrl}?s=${120 * pageNumber}`
      }
    }

    request(getUrl(), function (error, response, html) {
      if (error) {
        return cb(error, null)
      }
      const $ = cheerio.load(html)
      const housesOnThePage = $('.result-info')
      const scrappedInformation = housesOnThePage.map((i, value) => {
        const house = {}
        house.title = ($(value).find('.result-title').text())
        house.url = (domain + $(value).find('.result-title').attr('href'))
        house.time = ($(value).find('.result-date').attr('datetime'))
        house.price = ($(value).find('.result-price').text())
        $(value).find('.housing').text()
          .replace(/-/g, '')
          .replace(/ /g, '')
          .replace(/(^[ \t]*\n)/gm, '')
          .replace(/^\s*\n/g, '').split(/\r?\n/).map(value => {
            if (value.includes('br')) {
              house.bedrooms = value
            } if (value.includes('ft')) {
              house.size = value
            }
          })

        house.neighborhood = (($(value).find('.result-hood').text()
          .replace(/[{()}]/g, '')).trim())
        return house
      }).get()
      callback(scrappedInformation)
    })
  }

  const currentPage = 0
  const totalHouses = []
  const recursivecb = (arrayOfHouses) => {
    totalHouses.push(...arrayOfHouses)
    if (totalHouses.length > nDesired) {
      const result = totalHouses.splice(0, nDesired)
      return cb(null, result)
    } if (totalHouses.length === nDesired) {
      return cb(null, totalHouses)
    } else {
      return loadPage(currentPage + 1, totalHouses, recursivecb)
    }
  }

  loadPage(currentPage, totalHouses, recursivecb)
}

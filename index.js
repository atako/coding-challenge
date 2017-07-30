var request = require('request')
var cheerio = require('cheerio')

var domain = 'https://losangeles.craigslist.org'
var baseUrl = domain + '/search/apa'

module.exports = function (nDesired, cb) {

  const loadPage = (pageNumber, result, callback) => {
    if (currentPage > 4) {
      cb('test', null);
    }

    const getUrl = () => {
      if (pageNumber === 0) {
        return baseUrl;
      } if (pageNumber > 3) {
        cb('achieved maximum page count', null);
      } else {
        return `${baseUrl}?s=${120*pageNumber}`;
      }
    }
      
    request(getUrl(), function(error, response, html) {
      if (error) {
        return cb(error, null);
      }
      const $ = cheerio.load(html);
      const housesOnThePage = $('.result-info');
      const scrappedInformation = housesOnThePage.map((i, value) => {
        const house = {};
        house.title = ($(value).find('.result-title').text());
        house.url = (domain + $(value).find('.result-title').attr('href'));
        house.time = ($(value).find('.result-date').attr('datetime'));
        house.price = ($(value).find('.result-price').text());
        $(value).find('.housing').text()
          .replace(/-/g, '')
          .replace(/ /g, '')
          .replace(/^\s*\n/g, "").split(/\r?\n/).map(value => {
            value.includes('br') ? house.bedrooms = value : null;
            value.includes('ft') ? house.size = value : null;
        });
        house.neighborhood = (($(value).find('.result-hood').text()
          .replace(/[{()}]/g, '')).trim());
        return house;
      }).get();
      callback(scrappedInformation);
    });
  }

  loadPage(currentPage = 0, totalHouses = [], recursivecb = function(arrayOfHouses) {
    totalHouses.push(...arrayOfHouses);
    if (totalHouses.length > nDesired) {
        const result = totalHouses.splice(0, nDesired);
        return cb(null, result);
    } if (totalHouses.length === nDesired) {
      return cb(null, totalHouses);
    } else {
      return loadPage(currentPage + 1, totalHouses, recursivecb);
    }
  });
}

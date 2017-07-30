require('replay')

var tape = require('tape')
var getListings = require('./')

tape('should get 50 listings', function (t) {
  getListings(50, function (err, listings) {
    t.ifError(err, 'should not error')
    t.equal(50, listings.length)
    t.end()
  })
})

tape('should get 120 listings', function (t) {
  getListings(120, function (err, listings) {
    t.ifError(err, 'should not error')
    t.equal(120, listings.length)
    t.end()
  })
})

tape('should get 250 listings', function (t) {
  getListings(250, function (err, listings) {
    t.ifError(err, 'should not error')
    t.equal(250, listings.length)
    t.end()
  })
})

tape('should get correct listings format', function (t) {
  getListings(129, function (err, listings) {
    t.ifError(err, 'should not error')

    var listing = listings[128]
    t.deepEqual(listing, {
      title: 'OCEAN FRONT CONDO FOR LEASE',
      url: 'https://losangeles.craigslist.org/wst/apa/d/ocean-front-condo-for-lease/6222223652.html',
      time: '2017-07-28 07:19',
      price: '$4000',
      bedrooms: '2br',
      size: '1320ft2',
      neighborhood: 'Redondo Beach'
    }, 'should match expected')
    t.end()
  })
})

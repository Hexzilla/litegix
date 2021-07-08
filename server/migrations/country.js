var mongoose = require('mongoose');
const Country = mongoose.model("Country")

const countries = [
  'Afghanistan (غانستان)',
  'Åland Islands (Åland)',
]

module.exports = function() {
  Country.collection.drop()
  countries.forEach(name => {
    console.log('country', name)
    const country = new Country({name: name})
    country.save()
  })  
}
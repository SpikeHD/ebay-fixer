/**
 * Price formatter, snagged from another project of mine.
 */
function priceFormat(p) {
  p = '' + p
  let currencySymbol = p.replace(/[,.]+/g, '').replace(/\d/g, '')
  if (currencySymbol) p = p.replace(currencySymbol, '')

  if (!p.includes('.') && !p.includes(',')) {
    p += '.00'
  }

  // Strip symbols from number
  if (p.indexOf('.') > p.indexOf(',')) {
    const cents = p.split('.')[1]
    const dollars = p.split(`.${cents}`)[0].split(',').join('')

    p = `${dollars}.${cents}`
  } else {
    const cents = p.split(',')[1]
    const dollars = p.split(`,${cents}`)[0].split('.').join('')

    p = `${dollars}.${cents}`
  }

  p = currencySymbol + parseFloat(p).toLocaleString('en')

  return p
}

/**
 * When an item includes a shipping price, that price will be
 * added to the main price, and the shipping price will be shown
 * as "Shipping was: $XX.XX".
 */
(function () {
  // Sometimes the lists are different. Beats me as to why
  const list = $('#ListViewInner').length > 0 ?  $('#ListViewInner'):$('.srp-results')
  function getShipping(val) {
	  const shipping = $(val).find('.lvshipping').text().trim() || $(val).find('.s-item__shipping').text().trim()
  	return shipping.replace(/^\D+/g, '').replace(',', '')
  }
  
  function getPrice(val) {
  	const price = $(val).find('.lvprice').text().trim() || $(val).find('.s-item__price').text().trim()
  	return price.replace(/^\D+/g, '').replace(',', '')
  }

  list.children('li').each((i, val) => {
    // Get the objects, there are (from what I've seen) two different possibilities. Maybe there are more, idk
    const shipObj = $(val).find('.lvshipping').length > 0 ? $(val).find('.lvshipping'):$(val).find('.s-item__shipping')
    const priceObj = $(val).find('.lvprice').length > 0 ? $(val).find('.lvprice'):$(val).find('.s-item__price')
    
    // Get the currency for consistency I guess
    const currency = $(priceObj).text().trim().split('$')[0]
    const price = parseFloat(getPrice(val))
    const shipping = parseFloat(getShipping(val))
    
    // If there is a shipping price (parseFloat returns null if there isn't any float), change it up
    if(shipping) {
      $(shipObj).text(`Shipping was: $${shipping}`)
      $(priceObj).text(`${currency} $${Math.round((price+shipping + Number.EPSILON) * 100)/100}`)
    }
  })
})();

/**
 * Allows you to click the outside of the tracking window to close it.
 */
(function () {

})()
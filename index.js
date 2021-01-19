/**
 * Price formatter, snagged from another project of mine.
 */
function priceFormat(p) {
  p = '' + p
  let currencySymbol = p.replace(/[,.]+/g, '').replace(/[a-zA-Z\d\S]/g, '')
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
const list = $('#ListViewInner').length > 0 ? $('#ListViewInner') : $('.srp-results')
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
  const shipObj = $(val).find('.lvshipping').length > 0 ? $(val).find('.lvshipping') : $(val).find('.s-item__shipping')
  const priceObj = $(val).find('.lvprice').length > 0 ? $(val).find('.lvprice') : $(val).find('.s-item__price')
  const symbol = $(priceObj).text().trim().split(/[a-zA-Z\d]/g)[1].split(/[a-zA-Z\d]/g)[0]

  // Get the currency (eg. CAD, US)
  const currency = $(priceObj).text().trim().split(symbol)[0]
  const shipping = parseFloat(getShipping(val))
  
  let formattedPrice

  if ($(priceObj).text().trim().indexOf(symbol, $(priceObj).text().trim().indexOf(symbol)+1) != -1) {
    // Multiple prices
    let prices = $(priceObj).text().trim().split(' to ')

    prices = prices.map(p =>
      `${currency} ${symbol}${priceFormat(parseFloat(p.replace(/^\D+/g, '').replace(',', '')) + shipping)}`
    )

    formattedPrice = `${prices[0]} to ${prices[1]}`
  } else {
    // Singular price
    const price = parseFloat(getPrice(val))
    formattedPrice = `${currency} ${symbol}${priceFormat(price + shipping)}`
  }

  // If there is a shipping price (parseFloat returns null if there isn't any float), change it up
  if (shipping) {
    $(shipObj).text(`Shipping was: $${shipping}`)
    $(priceObj).text(formattedPrice)
  }
})

/**
 * Allows you to click the outside of the tracking window to close it.
 */
document.addEventListener('click', (evt) => {
  // Use vanilla listener, since the element won't exist yer
  if (evt.target.classList.contains('oly-m')) {
    // Simulating clicking the X is no enough, we have to
    // modify the attributes the dirty way
    $('#oly_1').css('pointer-events', 'all')
    document.getElementsByClassName('oly-c')[0].click()
  }
})

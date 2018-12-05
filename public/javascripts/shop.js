function addToCart(productid) {
  var cart = getCookie('cart');
  if (cart) {
    cart = cart.split(',');
    cart.push(productid);
    setCookie('cart', cart.join(','));
    updateCartCount(cart.length);
  } else {
    setCookie('cart', productid, 5);
    updateCartCount(1);
  }
  toast({
    type: 'success',
    title: 'Item added to cart!'
  })
}

function removeFromCart(index) {
  swal({
      title: 'Are you sure?',
      type: 'question',
      confirmButtonText: 'Remove',
      showCancelButton: true
    })
    .then((userConfirm) => {
      if (userConfirm.value) {
        var cart = getCookie('cart');
        if (cart) {
          cart = cart.split(',');
          cart.splice(index, 1);
          setCookie('cart', cart.join(','));
        }
        window.location.reload();
      }
    })
}

function removeItemElement(i) {
  $('#cart .list-group-item')[i].remove();
}

function updateCartCount(count) {
  let counterElement = $('.cart-counter');
  if (counterElement) counterElement.html(count);
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
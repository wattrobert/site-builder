let route = window.location.pathname;
console.log(route);
$('.nav-link[href="' + route + '"]').addClass('active');
// console.log(route);
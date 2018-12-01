let route = window.location.pathname;
let split = route.split('/');
$('.nav-link[href="/' + split[1] + '/' + split[2] + '"]').addClass('active');
/*! My JS */
document.addEventListener("DOMContentLoaded", function(event) {
	new Typed(".typedjs", { strings: ["A <span class='text-red-600'>developer</span>", "A <span class='text-red-600'>Student</span>", "A <span class='text-red-600'>Scratcher</span>", "A person named <span class='text-red-600'>William Horning</span>"], typeSpeed: 40, smartBackspace: true, loop: true })
});
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js', {
		scope: '/'
	}).then(function(registration) {
		console.log('Registration successful, scope is:', registration.scope);
	})
		.catch(function(error) {
			console.log('Service worker registration failed, error:', error);
		});
}
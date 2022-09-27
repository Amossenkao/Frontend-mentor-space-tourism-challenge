import data from './data.js';
const currentPage = document.body.dataset.page;
const screenType = {
	mobile: false,
	tablet: false,
	desktop: true,
};

let subNavButtons;

const mobileScreen = matchMedia('(max-width: 600px)');
const tabletScreen = matchMedia('(min-width: 601px) and (max-width: 1024px)');
const desktopScreen = matchMedia('(min-width: 1025px)');
const landscape = matchMedia(
	'(max-height: 600px) and (orientation: landscape)'
);

function checkScreenSize() {
	// Performs the appropiate action depending on the match media from the queries above

	screenType.mobile = mobileScreen.matches;
	screenType.tablet = tabletScreen.matches;
	screenType.desktop = desktopScreen.matches;

	const container = document.querySelector('.container');
	const mainElement = document.querySelector('main');
	let desktopNav = document.createElement('ul');
	desktopNav.className = 'sub-nav desktop';
	try {
		desktopNav.innerHTML = document.querySelector(
			'.sub-nav:not(.sub-nav.desktop)'
		).innerHTML;
	} catch {}

	if (screenType.desktop) {
		container.classList.remove('mobile', 'tablet');
		document.querySelector('.menu').classList.remove('active');
		if (currentPage === 'destinations') {
			desktopNav.classList.add('planet-list', 'upper-case');
			mainElement.prepend(desktopNav);
		} else if (currentPage === 'crew') {
			desktopNav.classList.add('nav-buttons');
			mainElement.append(desktopNav);
		} else if (currentPage === 'technology') {
			mainElement.append(desktopNav);
			document.querySelector('.technology.img-wrapper img').src =
				'../assets/technology/image-launch-vehicle-portrait.jpg';
		}
	} else {
		try {
			document.querySelector('.sub-nav.desktop').remove();
			document.querySelector('.technology.img-wrapper img').src =
				'../assets/technology/image-launch-vehicle-landscape.jpg';
		} catch {
			// Pass
		}

		if (screenType.mobile || landscape.matches) {
			if (screenType.mobile) {
				container.classList.add('mobile');
				container.classList.remove('tablet');
			}
			document.querySelector('.menu').classList.add('active');
		} else {
			document.querySelector('.menu').classList.remove('active');
			container.classList.add('tablet');
			container.classList.remove('mobile');
		}
	}
}

checkScreenSize();

mobileScreen.addListener(checkScreenSize);
tabletScreen.addListener(checkScreenSize);
desktopScreen.addListener(checkScreenSize);

// Menu toggle for mobile screens =========================> 👇👇

const navMenu = document.querySelector('.main-menu');
const toggleButtons = [...document.querySelectorAll('.menu, .close')];

toggleButtons.forEach((button) => {
	button.addEventListener('click', () => {
		button.classList.toggle('active');
		setTimeout(() => {
			if (button.classList.contains('menu')) {
				document.querySelector('.close').classList.toggle('active');
			} else {
				document.querySelector('.menu').classList.toggle('active');
			}
		}, 400);
		navMenu.classList.toggle('shown');
	});
});
// If the mobile nav menu is open and the user clicks outside of it, close the nav menu 👇👇
document.addEventListener('click', (event) => {
	const closeButton = document.querySelector('.close');
	if (
		closeButton.classList.contains('active') &&
		!navMenu.contains(event.target)
	) {
		closeButton.click();
	}
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 👆👆

function addListener() {
	// Adds an event listener to each of the sub-nav buttons
	if (screenType.desktop) {
		subNavButtons = [...document.querySelectorAll('.sub-nav.desktop > *')];
	} else {
		subNavButtons = [
			...document.querySelectorAll(
				'.main-container.active:not(.main-container.active.animate-left, .main-container.active.animate-right, .main-container.active.animate-up, .main-container.active.animate-down) .sub-nav:not(.sub-nav.desktop) > *'
			),
		];
	}

	subNavButtons.forEach((button, clickedIndex) => {
		button.addEventListener('click', () => {
			clickHandler(button, clickedIndex, subNavButtons);
		});
	});
}

function clickHandler(button, clickedIndex, buttons) {
	// Handles the event listener added to the sub-nav buttons by the addListener function

	// This little block of code adds the 'active' class to the clicked button and the CSS makes it stand out from the rest  👇👇
	let activeIndex;
	for (let btn of buttons) {
		if (btn.classList.contains('active')) {
			btn.classList.remove('active');
			activeIndex = buttons.indexOf(btn);
		}
	}
	button.classList.add('active');

	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>👆👆

	const pageData = data[`${currentPage}`][clickedIndex];
	try {
		const elem = document.querySelector(
			'.main-container.hidden.show.animate'
		);
		elem.classList.add('active');
		elem.classList.remove(
			'hidden',
			'show',
			'move-left',
			'move-right',
			'animate'
		);
	} catch {
		//   Pass in case the element doesn't exist on the page
	}

	const activeElement = document.querySelector(
		'.main-container.active:not(.main-container.active.animate-left, .main-container.active.animate-right, .main-container.active.animate-up, .main-container.active.animate-down)'
	);
	const element = createElement(activeElement);

	if (activeIndex === clickedIndex) {
		element.remove();
		return;
	} else {
		// Set the content of the element depending on the page and button clicked >>>>>>>>>>>>>>>>>>>>>> 👇👇

		if (currentPage === 'destinations') {
			element.querySelector('.planet-name').textContent = pageData.name;
			element.querySelector('.description-text').textContent =
				pageData.description;
			element.querySelector('.travel-time .data').textContent =
				pageData.travel;
			element.querySelector('.distance .data').textContent =
				pageData.distance;
			element.querySelector(
				'.planet-img'
			).src = `.${pageData.images.png}`;
		} else if (currentPage === 'crew') {
			element.querySelector('.person-title').textContent = pageData.role;
			element.querySelector('.person-name').textContent = pageData.name;
			element.querySelector('.person-bio').textContent = pageData.bio;
			element.querySelector(
				'.person-img'
			).src = `.${pageData.images.png}`;
			element.querySelector(
				'.person-img'
			).alt = `Image of ${pageData.name}`;
			if (clickedIndex === 1) {
				element.querySelector('.person-img').classList.add('mark');
			} else {
				element.querySelector('.person-img').classList.remove('mark');
				if (clickedIndex === 0) {
					element
						.querySelector('.person-img')
						.classList.add('douglas');
				} else {
					element
						.querySelector('.person-img')
						.classList.remove('douglas');
				}
			}
		} else {
			element.querySelector('.name').textContent = pageData.name;
			element.querySelector('.description').textContent =
				pageData.description;
			if (screenType.desktop) {
				element.querySelector(
					'.img-wrapper img'
				).src = `.${pageData.images.portrait}`;
			} else {
				element.querySelector(
					'.img-wrapper img'
				).src = `.${pageData.images.landscape}`;
			}
		}

		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>👆👆

		// Determine the direction of the animation ( right-to-left, left-to-right, top-to-bottom ect.) 👇👇

		if (activeIndex < clickedIndex) {
			if (currentPage === 'technology' && screenType.desktop) {
				element.classList.add('move-up', 'show');
				setTimeout(() => {
					element.classList.add('animate');
					activeElement.classList.add('animate-down');
				}, 50);
			} else {
				element.classList.add('move-right', 'show');
				setTimeout(() => {
					element.classList.add('animate');
					activeElement.classList.add('animate-left');
				}, 50);
			}
		} else {
			if (currentPage === 'technology' && screenType.desktop) {
				element.classList.add('move-down', 'show');
				setTimeout(() => {
					element.classList.add('animate');
					activeElement.classList.add('animate-up');
				}, 50);
			} else {
				element.classList.add('move-left');
				element.classList.add('show');
				setTimeout(() => {
					element.classList.add('animate');
					activeElement.classList.add('animate-right');
				}, 50);
			}
		}

		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>👆👆
		element.classList.add('active');
		setTimeout(() => {
			element.classList.remove(
				'hidden',
				'show',
				'move-left',
				'move-right',
				'animate',
				'move-up',
				'move-down'
			);
			activeElement.remove();
			document;
		}, 1000);
	}
}

// Creates an element on the fly and add it to the appropiate container upon request 👇👇
function createElement(activeElement) {
	try {
		const element = document.createElement('div');
		// const mainContainer = document.querySelector('.main-container.active');
		element.classList.add('main-container', 'hidden');
		if (currentPage === 'technology' && screenType.desktop) {
			element.classList.add('technology');
		}
		element.innerHTML = activeElement.innerHTML;
		activeElement.parentElement.append(element);
		return element;
	} catch {
		// Pass if there is an exception
	}
}

addListener();

document.addEventListener('mouseup', addListener);

// Sub-nav animation >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>👆👆

// Slow rotation effect on the logo and the planet images on the destination page 👇👇

let degrees = 0;
setInterval(() => {
	document.querySelector('.logo').style.transform = `rotate(${degrees}deg)`;
	if (currentPage === 'destinations') {
		document.querySelector(
			'.planet-img'
		).style.transform = `rotate(${degrees}deg)`;
	}
	degrees += 0.25;
}, 25);

// Swipe events for touch devices 👇👇

function touchEventHandler() {
	let startingX, startingY, changesX, changesY, swapStartTime, timeDifference;
	document.addEventListener('touchstart', (event) => {
		addListener();
		startingX = event.touches[0].pageX;
		startingY = event.touches[0].pageY;
		swapStartTime = event.timeStamp;
	});

	document.addEventListener('touchmove', (event) => {
		changesX = startingX - event.touches[0].pageX;
		changesY = startingY - event.touches[0].pageY;
	});

	document.addEventListener('touchend', (event) => {
		let activeIndex;
		subNavButtons.forEach((button, index) => {
			if (button.classList.contains('active')) {
				activeIndex = index;
			}
		});

		timeDifference = event.timeStamp - swapStartTime;
		if (changesX > 0) {
			if (
				changesX > changesY &&
				changesY < 75 &&
				changesY > -75 &&
				changesX >= 75 &&
				timeDifference <= 500
			) {
				try {
					subNavButtons[`${activeIndex + 1}`].click();
				} catch {}
			}
		} else if (changesX < 0) {
			if (
				changesX < changesY &&
				changesY > -75 &&
				changesY < 75 &&
				changesX <= -75 &&
				timeDifference <= 500
			) {
				try {
					subNavButtons[`${activeIndex - 1}`].click();
				} catch {}
			}
		}
	});
}

touchEventHandler();

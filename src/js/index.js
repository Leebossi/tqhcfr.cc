const initMobileNav = () => {
	const toggle = document.querySelector('.nav__toggle');
	const nav = document.querySelector('#siteNav');
  const bars = document.querySelector('.nav__toggle-bars');

	if (!toggle || !nav) {
		return;
	}

	toggle.addEventListener('click', () => {
		const isOpen = nav.classList.toggle('is-open');
		toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    bars.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	});

	nav.querySelectorAll('a, button').forEach((link) => {
		link.addEventListener('click', () => {
			if (link.id === 'langToggle') {
				return;
			}
			nav.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
			bars.setAttribute('aria-expanded', 'false');
		});
	});
};

document.addEventListener('DOMContentLoaded', initMobileNav);

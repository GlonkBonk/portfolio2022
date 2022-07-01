
function dots(){};
var pc = 10000//pc = particle count




if (window.innerWidth.valueOf() < 750) { 
	pc = 5000;
	console.log(pc);
}



  function Particle(screen, x, y) { //stores Lenght xy starting points and width xy ending points and uses v as the second vector
    this.screen = screen;
    this.p = vec4.get(x, y);
    this.l = vec4.get(x, y);
    this.v = vec4.get();
  }

  Particle.prototype.reset = function(x, y) { //generates respawn points 
    if(x == null || y == null) if(Math.random() < 0.5) { //vertical respawn points 
      x = this.screen.width  * (Math.random());
      y = this.screen.height * (Math.random() + 0.5 | 0);
    } else { // horizontal respawn points 
      x = this.screen.width  * (Math.random() + 0.5 | 0);
      y = this.screen.height * (Math.random());
    }
    //sets the out of bounds parimeters 
    vec4.set(this.p, x, y);
    vec4.set(this.l, x, y);

  };

  Particle.prototype.outOfBounds = function() { //checks if a pc went out of bounds on width or the height of the screen 
    return this.p[0] < 0 || this.p[0] > this.screen.width
        || this.p[1] < 0 || this.p[1] > this.screen.height;
  };

  Particle.prototype.update = function() { //main particle function
    if(this.outOfBounds()) return; //if out of OFB triggers it inatiats another instance of update
    //main movement calculations adjust xyz values for diffrent results
    var x = 0.0050 * this.p[0];
    var y = 0.0050 * this.p[1];
    var z = 0.0001 * this.screen.now;
    var r =  Math.random() * 0.25;       
    var t = Math.random() * Math.PI * 2;

    vec4.set(vec4.buffer,
      //adds noise trails behind the moving dots with  noise-simplex.js library on both the vertical and horizotal axes 
      r * Math.sin(t) + this.screen.simplex.noise3D(x, y, +z),
      r * Math.cos(t) + this.screen.simplex.noise3D(x, y, -z)
    );

    vec4.add(this.v, vec4.buffer, this.v); //adds and sets vector data
    vec4.mul(this.v, 0.9500, this.v);
    vec4.set(this.l, this.p, this.l);
    vec4.add(this.p, this.v, this.p);

    return true;
  };

  function Field(container) { //contructor 
    this.loop      = this.loop.bind(this);
    // this.canvas    = util.tag('canvas', null, container);
	this.canvas = document.getElementById("dotcanvas");
    this.info      = util.tag('code',   null, container);
    this.context   = this.canvas.getContext('2d');
    this.dots     = new dots(this.canvas);
    this.simplex   = new SimplexNoise();
    this.particles = [];
    this.loop();
  }

  Field.prototype.spawn = function() { //the function loads in the amount of particles that are equal to i 
    for(var i = pc - this.particles.length; i--;)
      this.particles.push(new Particle(this));
  };

  
  Field.prototype.resize = function() { //the function checks the size of the clients screen and adjusts the canvas width and height values 
    var w = this.canvas.clientWidth;
    var h = this.canvas.clientHeight;
    if(this.canvas.width  !== w
    || this.canvas.height !== h) {
      this.width  = this.canvas.width  = w;
      this.height = this.canvas.height = h;
      this.clear();
    }
  };



  Field.prototype.clear = function() { //clears noise-simplex.js traveled path 
    this.context.fillStyle = util.color.rgba(1, 1, 1);
    this.context.fillRect(0, 0, this.width, this.height);
  };

  Field.prototype.render = function() {
    this.context.beginPath();

    for(var p, i = 0; p = this.particles[i++];) if(p.update()) { //tells vec4 where to move the dots to.  lineTo tell where the start and en points are. 
      this.context.moveTo(p.l[0], p.l[1]);
      this.context.lineTo(p.p[0], p.p[1]);
    } else p.reset(); // this.particles.splice(--i, 1);

    this.context.globalCompositeOperation = 'lighter';
    this.context.strokeStyle = util.color.rgba(0.25, 0.10, 0.75, 0.65);//rgba values of dots
    this.context.stroke();

    this.context.globalCompositeOperation = 'source-over';
    this.context.fillStyle = util.color.rgba(0, 0, 0, 0.05);//rgba values of background
    this.context.fillRect(0, 0, this.width, this.height);
  };

  Field.prototype.update = function() { //render 
    // fps = console.log(this.info.textContent = util.fps(true)); //fps counter for data collection 
    this.now = Date.now();
    this.resize();
    this.spawn();
    this.render();  

  };



  Field.prototype.loop = function() {
    requestAnimationFrame(this.loop);
    this.update();
  };

  window.addEventListener('load', function () {
    new Field(document.body);
  }, false);

 

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 125,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);
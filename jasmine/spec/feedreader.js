/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */
/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('should be defined, and non empty', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* DONE: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('should have a non empty, "url" attribute', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toMatch(/^$/);
            });
        });


        /* DONE: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('should have a non empty, "name" attribute', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toMatch(/^$/);
            });
        });
    });


    /* DONE: Write a new test suite named "The menu" */
    describe('The menu', function() {

        beforeAll(function(done) {
            spyOn(window, 'loadFeed').and.callThrough();
            setTimeout(function() {
                expect(window.loadFeed).toHaveBeenCalled();
                expect(window.loadFeed.calls.count()).toBe(1); //initial loadFeed call, all should be at default state.
                done();
            }, 1);
        });

        /* DONE: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('should be hidden by default', function() {
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });

        /* DONE: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('shoould toggle feed list visibility when icon clicked', function() {
            var menuLink = $('a.menu-icon-link');
            expect($('body').hasClass('menu-hidden')).toBe(true);
            menuLink.trigger('click');
            expect($('body').hasClass('menu-hidden')).toBe(false);
            menuLink.trigger('click');
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });
    });

    /* DONE: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
        beforeAll(function(done) {
            setTimeout(function() {
                // do setup for spec here
                window.loadFeed(0, function() {
                    done(); //begin test when loadFeed finishes.
                });
                // then call done() in beforeEach() to start asynchronous test
            }, 1);
        });

        /* DONE: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test wil require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it('should contain at least one .entry-link within .feed container', function(done) {
            expect($('.feed').find('a.entry-link').length).toBeGreaterThan(0);
            done();
        });

    });

    /* DONE: Write a new test suite named "New Feed Selection"*/
    describe("New Feed Selection", function() {

        var originalTimeout;
        beforeEach(function(done) {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

            setTimeout(function() {
                // do setup for spec here
                window.loadFeed(0, function() {
                    done(); //begin test when loadFeed finishes.
                });
                // then call done() in beforeEach() to start asynchronous test
            }, 1);
        });

        beforeAll(function(done) {
            var self = this;

            spyOn(window,'loadFeed');

            /**
            * Function uses jquery functionality to access page dom and extract
            * entries from article elements from .feed class element.
            *
            * @return      an array, containing objects(linkTitle, href) for each feed entry.
            */
            this.extractFeedEntries = function() {

                /** PSEUDOCODE: entry info extraction from feed html structure
                **  0   .feed
                **  1.      .entry-link[] - href
                **              article
                **  2.              h2 = entry title
                **/
                var entries = [];
                $('.feed').children().toArray().forEach(function(entryLink) {
                    var feedEntryInfo = {};
                    feedEntryInfo.href = $(entryLink).attr('href');

                    var entryHtml = $(entryLink).find('article.entry').html();
                    feedEntryInfo.linkTitle = $('h2', '<div>' + entryHtml + '</div>').text().trim();

                    entries.push(feedEntryInfo);
                });
            };

            this.prevFeed = {};
            this.presentFeed = {};

            /*

                    this.prevFeed.title = $('.header-title').html();
                    this.prevFeed.links = this.extractFeedEntries();
            */
        });

        afterEach(function() {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        /* DONE: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        it('should change when loadFeed is called', function() {
            var self = this;
            expect(window.loadFeed).toHaveBeenCalled();


/*

            window.loadFeed(1, function() {
                //this.presentFeed.title = $('.header-title').html();
                //this.presentFeed.links = this.extractFeedEntries();
                console.log("hi");
                done();

                expect(this.presentFeed.title).not.toMatch(this.prevFeed.title);

                var longest;
                var shortest;

                if (this.prevFeed.links.length !== this.presentFeed.links.length) {
                    if (this.prevFeed.links.length > this.presentFeed.links.length) {
                        longest = this.prevFeed.links;
                        shortest = this.presentFeed.links;
                    } else {
                        longest = this.presentFeed.links;
                        shortest = this.prevFeed.links;
                    }
                } else {
                    shortest = this.presentFeed.links;
                    longest = this.prevFeed.links;
                }

                var len = shortest.length;
                for (var i = 0; i < len; i++) {
                    expect($(shortest[i]).html().trim()).not.toMatch($(longest[i]).html().trim());
                }


            }.bind(self));
            */
        });
    });
}());
(function (module) {

    function SegmentLoader(hasLoaded) {

        this.hasLoaded = hasLoaded || false;

        this.load = function (apiKey, delayMs) {
            if (window.analytics.initialized) {
                console.warn('Warning: Segment analytics has already been initialized. Did you already load the library?');
            }

            if (this.hasLoaded) {
                throw new Error('Attempting to load Segment twice.');
            } else {

                // Only load if we've been given or have set an API key
                if (apiKey) {

                    // Prevent double .load() calls
                    this.hasLoaded = true;

                    window.setTimeout(function () {
                        // Create an async script element based on your key.
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        // Up to date snippet with: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/#step-2-copy-the-segment-snippet
                        script.innerHTML = `
                            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${apiKey}";analytics.SNIPPET_VERSION="4.13.2";
                            analytics.load("${apiKey}");
                        `;

                        script.onerror = function () {
                            console.error('Error loading Segment library.');
                        };

                        // Insert our script next to the first script element.
                        var first = document.getElementsByTagName('script')[0];
                        first.parentNode.insertBefore(script, first);
                    }, delayMs);
                } else {
                    throw new Error('Cannot load Analytics.js without an API key.');
                }
            }
        };
    }

    function SegmentLoaderProvider() {

        // Inherit .load()
        SegmentLoader.call(this);

        this.$get = function () {
            return new SegmentLoader(this.hasLoaded);
        };
    }

    // Register with Angular
    module.provider('segmentLoader', SegmentLoaderProvider);

})(angular.module('ngSegment'));

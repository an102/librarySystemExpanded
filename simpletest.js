/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * View the JavaScript console to see failure reasons.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="tinytest.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */

/*
Extra todos for simpletest:

(1) Get successes to be green.
(2) Make sure only one error per failure goes to the console.
(2) Make failures red.
(3) Show track traces for failures.
(4) Only show stack traces if you click expand.
(5) Output summary statistics to the DOM.
*/

var TinyTestHelper = {
    renderStats: function (tests, failures) {
        var numOfTests = Object.keys(tests).length;
        var successes = numOfTests - failures;
        var summaryStatistics = document.createElement('h1');
        summaryStatistics.innerHTML = 'Number of tests: ' + numOfTests + '. ' +
            'Number of successes: ' + successes + '. ' +
            'Number of failures: ' + failures + '.';
        document.body.appendChild(summaryStatistics);
    }
};

var TinyTest = {
    run: function (tests) {
        var failures = 0;
        for (var testName in tests) {
            var testAction = tests[testName];
            try {
                testAction();
                // Note that spaces are manually added below because when multiple args are passed
                // with commas, unlike with pluses, a space is added after each (including last)
                console.log('%c ' + testName + '. ', 'color: green');
            } catch (e) {
                failures++;
                console.groupCollapsed('%c ' + testName + '. ', 'color: red');
                console.error(e.stack);
                console.groupEnd;
            }
        }

        setTimeout(function () { // Give document a chance to complete
            if (window.document && document.body) {
                document.body.style.backgroundColor = (failures == 0 ? '#99ff99' : '#ff9999');
                TinyTestHelper.renderStats(tests, failures);
            }
        }, 0);
    },

    fail: function (msg) {
        throw new Error('fail(): ' + msg);
    },

    assert: function (value, msg) {
        if (!value) {
            throw new Error('assert(): ' + msg);
        }
    },

    assertEquals: function (expected, actual) {
        if (expected != actual) {
            throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
        }
    },

    assertStrictEquals: function (expected, actual) {
        if (expected !== actual) {
            throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
        }
    },
};

var fail = TinyTest.fail,
    assert = TinyTest.assert,
    assertEquals = TinyTest.assertEquals,
    eq = TinyTest.assertEquals, // alias for assertEquals
    assertStrictEquals = TinyTest.assertStrictEquals,
    tests = TinyTest.run;

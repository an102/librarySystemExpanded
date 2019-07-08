(function () {
    var storage = {};

    function librarySystem(library, dependencies, callback) {
        if (arguments.length === 1 && !storage[library]) {
            throw new Error('Library "' + library + '" does not exist');
        } else if (arguments.length === 1) {
            // use case
            return returnLibrary(library);
        } else if (storage[library]) {
            throw new Error('Library "' + library + '" has already been stored');
        } else {
            // create case
            storage[library] = {
                dependencies: dependencies,
                callback: callback,
                contents: undefined
            }
        }
    }

    function returnLibrary(library) {
        var storedLibrary = storage[library];

        if (storedLibrary.contents) {
            return storedLibrary.contents;
        } else if (!storedLibrary.dependencies.length && !storedLibrary.contents) {
            storedLibrary.contents = storedLibrary.callback();
            return storedLibrary.contents;
        } else {
            // recursively retrieve all required dependencies 
            var storedDependencies = storedLibrary.dependencies.map(function (dependency) {
                if (!storage[dependency]) {
                    throw new Error('Missing dependency "' + dependency + '" for library "' + library + '"');
                } else {
                    return returnLibrary(dependency);
                }
            });

            storedLibrary.contents = storedLibrary.callback.apply(this, storedDependencies);
            return storedLibrary.contents;
        }
    }
    window.librarySystem = librarySystem;
})();
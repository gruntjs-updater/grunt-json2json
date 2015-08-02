# grunt-json2json

> Populate JSON files with properties from other JSON files.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-json2json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-json2json');
```

## The "json2json" task

### Overview
In your project's Gruntfile, add a section named `json2json` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  json2json: {
    // Task specific options
    options: {
      indent: '  '        // Destination files will be indented with two white spaces
    },
    // Target specific options
    example_target: {
      src: ['source1.json', 'source2.json'],           // Source JSON files to read properties from.
      dest: ['destination1.json', 'destination2.json'] // Destination JSON files to be updated or created with properties from sources.
      options: {
        updateOnly: true, // Only existing properties in destinations will be populated from sources. No properties will be added.
        pointers: [       // Only properties in the sources pointed by these JSON pointers will populate destinations.
          '/foo',
          '/bar/baz'
        ]
        map: {            // Map properties in the sources to other properties in the destinations.
          '/foo': '/remapped_foo',
          '/bar/baz': '/remapped_barbaz'
        }
      }
    },
  },
});
```

### Options

#### options.updateOnly
Type: `Boolean`
Default value: `false`

If `true`, only properties already existing in the destination files will be populated with values from the source files. *Note that if a specified destination doesn't exist, an empty JSON file will be created.*

If `false`, properties that don't exist yet in the destination files will be added.

#### options.pointers
Type: `Array`
Default value: `[]`

An `Array` of [JSON pointers](http://tools.ietf.org/html/rfc6901) that define the properties in the sources that will populate the destinations.

Example:

```js
json2json: {
  options {
    pointers: [
      '/foo',
      '/bar'
    ]
  }
}
```
with source
```JSON
{
  "foo": "some value",
  "bar": "some other value",
  "baz": "yet another value"
}
```
will output
```JSON
{
  "foo": "some value",
  "bar": "some other value"
}
```

If `options.pointers` is not defined or empty, by default all the properties from the source files will populate the destination files.

#### options.map
Type: `Object`
Default value: `{}`

An `Object` that defines how [JSON pointers](http://tools.ietf.org/html/rfc6901) in the source files are mapped in the destination files.

Example:

```js
json2json: {
  options {
    map: {
      '/foo': '/remapped_foo',
      '/bar/baz': '/remapped_barbaz'
    }
  }
}
```
with source file
```JSON
{
  "foo": "some value",
  "bar": {
    "baz": "some other value"
  }
}
```
will output
```JSON
{
  "remapped_foo": "some value",
  "remapped_barbaz": "some other value"
}
```

#### options.indent
Type: `String`|`Number`
Default value: `\t`

The `String` or number of white spaces used for indentation in the destination files (see [JSON.stringify](http://www.ecma-international.org/ecma-262/5.1/#sec-15.12.3)).

### Usage Examples

#### Populating `bower.json` and `component.json` from `package.json`
If your project uses [Bower](http://bower.io/) and/or [Component](https://github.com/componentjs/component/) to manage your front-end packages, you might want to keep in synch data from the different configuration files (`package.json`, `bower.json` and `component.json`). If you decide that `package.json` is the master file where you edit the common data, you can synch `bower.json` and/or `component.json` using `json2json`:

##### Simple update
This simply synchs all properties with the same name from `package.json` to `bower.json` and `component.json`.
```js
grunt.initConfig({
  json2json: {
    synchConfigs: {
      src: 'package.json',
      dest: ['bower.json', component.json],
      options: {
        updateOnly: true // This assumes that bower.json and component.json are already set up with the needed properties.
      }
    }
  }
});
```

##### Targeted update, add missing properties in destinations
```js
grunt.initConfig({
  json2json: {
    synchConfigs: {
      src: 'package.json',
      dest: ['bower.json', component.json],
      options: {
        pointers: [       // This ensures that only those properties will be updated if found in package.json.
          '/name',        // Because updateOnly defaults to false, they will be added to bower.json and component.json if missing.
          '/description',
          '/version',
          '/license',
          '/keywords',
          '/repository'
          '/private'
        ]
      }
    }
  }
});
```

##### Targeted update with remapping
This uses two targets to handle the differences in data models between `package.json`, `bower.json` and `component.json`.
```js
grunt.initConfig({
  json2json: {
    options: {
      src: 'package.json'
      pointers: [
          '/name',
          '/description',
          '/version',
          '/license',
          '/keywords',
          '/repository'
          '/private'
      ]
    },
    bower: {
      dest: 'bower.json',
      options: {
        pointers: <%= json2json.options.pointers %>.concat([
          '/author',
          '/contributors',
          '/homepage'
        ]),
        map {
          '/author': '/authors/-',
          '/contributors': '/authors/-'
        }
      }
    },
    component: {
      dest: 'component.json'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

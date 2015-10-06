Install
-------

`npm install --save quick-config`

Usage
-----

```javascript
var quickConfig = require('quick-config');

var settings = quickConfig('config.json', {
    editable: false,
    viewable: true
});

settings.save({
    editable: true
}).then(function(data){

    settings.load().then(function(config){
        for(var n in data){
            console.log(n+' = '+data[n]);
        }
    }, function(err){
        console.log(err);
    });
}, function(err){
    console.log(err);
});

```

### costructor(filename, defaults) -> settings object

filename should be a string, and will be where your json is stored. Parent folders are automatically created.

defaults is an object that is automatically merged with json loaded with quick-config. Fields that aren't set in the loaded json will use the fields from defaults. You might call this your **config model**.

### settings.save(json) -> promise

Save your json object.

### settings.load() -> promise

Load your json. The defaults will be merged with the returned value.

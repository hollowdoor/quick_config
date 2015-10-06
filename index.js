var readJSON = require('read-json'),
    writeJSON = require('write-json'),
    mkdirp = require('mkdirp-omen'),
    path = require('path'),
    fs = require('fs');

/*
git remote add origin https://github.com/hollowdoor/quick_config.git
git push -u origin master
*/

module.exports = function(file, defaults){
    return new QuickConfig(file, defaults);
};

function QuickConfig(file, defaults){
    this._file = file;
    this._defaults = defaults || {};
    var parts = file.split(path.sep);
    if(parts.length){
        parts.splice(-1, 1);
        this._base = parts.join(path.sep);
    }else{
        this._base = null;
    }
}

QuickConfig.prototype = {
    constructor: QuickConfig,
    save: function(json){
        var self = this;
        json = this._mergeDefaults(json);

        return new Promise(function(resolve, reject){
            if(!self._base){
                writeJSON(self._file, json, function(err){
                    if(err) return reject(err);
                    resolve(json);
                });
            }else{
                mkdirp(self._base).then(function(){
                    writeJSON(self._file, json, function(err){
                        if(err) return reject(err);
                        resolve(json);
                    });
                }, function(err){
                    reject(err);
                });
            }

        });

    },
    load: function(){
        var self = this;
        return new Promise(function(resolve, reject){
            fs.exists(self._file, function(exists){
                if(!exists){
                    return resolve(self._mergeDefaults({}));
                }
                readJSON(self._file, function(err, json){
                    if(err) return reject(err);
                    resolve(self._mergeDefaults(json));
                });
            });

        });
    },
    _mergeDefaults: function(json){
        for(var n in this._defaults){
            if(!(n in json)){
                json[n] = this._defaults[n];
            }
        }
        return json;
    }
};

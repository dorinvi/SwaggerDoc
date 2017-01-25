// get all files
var extension = '.js';
var fs = fs || require('fs');
var path = path || require('path');

var service = require("./build/repo/api/swagger/info.js");

const getAllFiles = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach( file => {
        var dirFile = path.join(dir,file);
        filelist = fs.statSync( dirFile ).isDirectory()
            ? getAllFiles( dirFile, filelist)
            : filelist.concat( dirFile );
    });
    return filelist;
};

// get only JS files
var srcPath = process.argv.splice(2);
console.log( srcPath[1] );

var allFiles = getAllFiles( srcPath[1] );
var jsFiles = allFiles.filter ( function (file) {
	return file.indexOf( extension, file.length - extension.length ) !== -1; // 2nd param needed to maje a difference between .js and .json
});

console.log( JSON.stringify( jsFiles ) );

// generate json doc

// -> initialize Swagger
var swaggerJSDoc = require('swagger-jsdoc');
var options = {
  swaggerDefinition: {
    info: {
      title: service.info.title,
      version: service.info.version
    },
  },
  apis: jsFiles // Path to the API docs
};

var swaggerSpec = swaggerJSDoc(options);

// -> write file
fs.writeFile(srcPath[0], JSON.stringify( swaggerSpec , null, '\t'), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log( "Done!" );
});

/*
 * https://www.npmjs.com/package/swagger-jsdoc
 */

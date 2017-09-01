var marked = require('marked');
var fs = require('fs');

var readMe = fs.readFileSync('./views/README.md', 'utf-8');
var markdownReadMe = marked(readMe);

fs.writeFileSync('./views/README.html', markdownReadMe);
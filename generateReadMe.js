var marked = require('marked');
var fs = require('fs');
var file = 'historyIndex';

var readMe = fs.readFileSync('./mdFiles/' + file + '.md', 'utf-8');
var markdownReadMe = marked(readMe);

fs.writeFileSync('./views/' + file + '.html', markdownReadMe);

var counter = require('sliding-window-counter');
var keypress = require('keypress');
var _ = require('lodash');

var counters = {};
var secs = 5;

console.log("Counts (last " + secs + " seconds): ");

keypress(process.stdin);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.setRawMode(true);

process.stdin.on("keypress", function(ch, key) {
  if (!key) { return; }
  if (key.ctrl && key.name == 'c') {
    process.exit(0);
  }

  counters[key.name] || (counters[key.name] = counter(secs * 1000));
  counters[key.name](1);
});

setInterval(function() {
  var status = "";
  var total = 0;

  _.forEach(counters, function(cnt, key) {
    var c = cnt();
    if (c === 0) {
      delete(counters[key]);
    } else {
      status += (key + ":" + c + "; ");
      total += c;
    }
  });

  if (total > 0) {
    console.log(status);  
  }
}, 1000);

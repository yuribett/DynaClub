var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();

console.log('running thread');

if (cluster.isMaster) {
    console.log('thread master');

    cpus.forEach(function () {
        cluster.fork();
    });

    cluster.on('listening', function (worker) {
        console.log('cluster cennected ' + worker.process.pid);
    });

    cluster.on('exit', worker => {
        console.log('cluster %d diconnected', worker.process.pid);
        cluster.fork();
    });

} else {
    console.log('thread slave');
    require('./server.js')
}
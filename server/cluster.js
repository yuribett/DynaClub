const cluster = require('cluster');
const os = require('os');
const cpus = os.cpus();

console.log('running thread');

if (cluster.isMaster) {
    console.log('thread master');

    cpus.forEach(() => {
        cluster.fork();
    });

    cluster.on('listening', worker => {
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
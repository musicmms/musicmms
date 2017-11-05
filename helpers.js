const fs = require('fs');
const youtubedl = require('youtube-dl');

exports.downloadVideo = (vlink) => {
    let video = youtubedl(vlink,
    ['--format=18'],
    { cwd: __dirname });

    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info.filename);
        console.log('size: ' + info.size);
    });
    video.pipe(fs.createWriteStream('/res/video/' + info.filename + '.mp4')); 
}

exports.searchVideo = (title, opts) => {
    search(title, opts, (err, results) => {
        if(err) return console.log(err);
        return results;
    })
}
const fs = require('fs');
const youtubedl = require('youtube-dl');
const search = require('youtube-search');

exports.downloadVideo = (vlink) => {
    let video = youtubedl(vlink,
    ['--format=18'],
    { cwd: __dirname });

    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
        video.pipe(fs.createWriteStream('musicmms/res/video/' + info._filename));
    });
     
}


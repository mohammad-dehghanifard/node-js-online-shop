const { throws } = require('assert');
const fs = require('fs');

const fileClear = (filePath) => {
    fs.unlink(filePath,(err) => {
        if(err){
            throw err;
        }
    })
}

exports.fileClear = fileClear;
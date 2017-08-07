const originUrl = '/api/books/add';
function replace(src) {
    return src.replace(/\/api\/(.*)\/(.*)/,'\/$1\/$2\.json');
}

console.log(replace(originUrl));
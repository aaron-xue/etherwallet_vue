//校验密码
function isStrongPass(password) {
    return password.length > 8;
};

function getBlob(mime, str) {
    var str = (typeof str === 'object') ? JSON.stringify(str) : str;
    if (str == null) return '';
    var blob = new Blob([str], {
        type: mime
    });
    return window.URL.createObjectURL(blob);
};

export default {
    isStrongPass,
    getBlob
}
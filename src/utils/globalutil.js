//校验密码
function isStrongPass(password) {
    return password.length > 8;
};

export default {
    isStrongPass
}
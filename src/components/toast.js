import '../../static/css/mystyle.css'

//toastSuccess
function toastSuccess(title,content) {
    var toast = document.createElement('div')
    toast.className = 'toast'
    if (!title) {
        title = 'success'
    }
    toast.innerHTML =`<div><i id='toast_success'></i><h3>${title}</h3><p>${content}</p></div>`
    document.body.appendChild(toast);
    document.querySelector('#toast_success').addEventListener('click', ()=>{
        closeToast();
    })
}
//toastClose
function closeToast() {
    document.body.querySelector('.toast').remove();
}

//toastFaill
function toastFaill(title,content) {
    var toast = document.createElement('div')
    toast.className = 'toast'
    if (!title) {
        title = 'faill'
    }
    toast.innerHTML =`<div><i id='toast_faill'></i><h3>${title}</h3><p>${content}</p></div>`
    document.body.appendChild(toast);
    document.querySelector('#toast_faill').addEventListener('click', ()=>{
        closeToast();
    })
}
export default{
    toastSuccess,
    toastFaill,
    closeToast
}
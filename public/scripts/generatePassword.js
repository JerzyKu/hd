document.querySelectorAll(".passGenBtn").forEach((el) => {
    el.addEventListener('click', (event) => {
        event.preventDefault()
        console.log(document.querySelectorAll(".password-input"));
        document.querySelector(".password-input").value = randPass()
    })
})

const charList = 'abcdefghijklmnopqrstuwxyz1234567890'

const randPass = () => {
    let out = ""
    for(i = 0; i < 16; i++){
        const los = Math.floor(Math.random() * charList.length)
        out += charList.substring(los, los + 1)
    }
    return out
}
const generatePassword = () =>{
    let length = 8;
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+'
    let password = '';
    for(let i = 0; i< length;i++){
        let random = Math.floor(Math.random()*characters.length);
        password += characters.charAt(random);
    }
    return password;
}
module.exports = generatePassword;
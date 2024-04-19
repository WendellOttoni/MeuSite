let btnMenu = document.getElementById('abrir-menu')
let menu = document.getElementById('menu-mobile')

btnMenu.addEventListener('click',() =>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click',() =>{
    menu.classList.remove('abrir-menu')
})

function scrollParaSecao(idSecao) {
    var secaoDestino = document.getElementById(idSecao);
    secaoDestino.scrollIntoView({ behavior: "smooth" });
}
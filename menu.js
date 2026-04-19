// Menu mobile
let btnMenu = document.getElementById('abrir-menu')
let menu = document.getElementById('menu-mobile')

btnMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', () => {
    menu.classList.remove('abrir-menu')
})

// Scroll suave para seção
function scrollParaSecao(idSecao) {
    var secaoDestino = document.getElementById(idSecao);
    secaoDestino.scrollIntoView({ behavior: "smooth" });
}

// Header glassmorphism ao rolar
const header = document.getElementById('header')
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled')
    } else {
        header.classList.remove('scrolled')
    }
})

// Animação de entrada por scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
}, { threshold: 0.1 })

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))

// Efeito de digitação no hero
const phrases = ['mundo criativo.', 'código limpo.', 'próximo projeto.']
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
const typedEl = document.querySelector('.typed-text')

function type() {
    if (!typedEl) return

    const current = phrases[phraseIndex]

    if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1)
        charIndex--
    } else {
        typedEl.textContent = current.substring(0, charIndex + 1)
        charIndex++
    }

    let speed = isDeleting ? 70 : 110

    if (!isDeleting && charIndex === current.length) {
        speed = 2200
        isDeleting = true
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        phraseIndex = (phraseIndex + 1) % phrases.length
        speed = 400
    }

    setTimeout(type, speed)
}

type()

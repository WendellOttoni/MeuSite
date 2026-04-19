// Menu mobile
let btnMenu = document.getElementById('abrir-menu')
let menu = document.getElementById('menu-mobile')

btnMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
})

document.querySelector('.btn-fechar-icon')?.addEventListener('click', () => {
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

// Carrega projetos dinamicamente via GitHub API
const GITHUB_USER = 'WendellOttoni'
const REPO_IGNORE = [] // nomes de repos para ocultar, se quiser

const langColors = {
    JavaScript: '#f0db4f',
    TypeScript: '#3178c6',
    Python:     '#3572A5',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    default:    '#fe4701'
}

async function loadProjects() {
    const grid = document.getElementById('projects-grid')
    if (!grid) return

    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const repos = await res.json()
        if (!Array.isArray(repos)) throw new Error(repos.message || 'Resposta inválida')

        const filtered = repos.filter(r => !r.fork && !REPO_IGNORE.includes(r.name))

        grid.innerHTML = filtered.map(repo => {
            const lang = repo.language || '—'
            const color = langColors[lang] || langColors.default
            const desc = (repo.description || 'Sem descrição.')
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

            return `
            <div class="project-card">
                <div class="card-header">
                    <i class="bi bi-folder2-open card-icon"></i>
                    <a href="${repo.html_url}" target="_blank" class="card-link">
                        <i class="bi bi-arrow-up-right-square"></i>
                    </a>
                </div>
                <h3>${repo.name}</h3>
                <p>${desc}</p>
                <div class="card-badges">
                    <span class="badge" style="--lang-color:${color}">${lang}</span>
                    ${repo.stargazers_count > 0 ? `<span class="badge badge-star"><i class="bi bi-star-fill"></i> ${repo.stargazers_count}</span>` : ''}
                </div>
            </div>`
        }).join('')

    } catch (e) {
        grid.innerHTML = `<p style="color:#777;padding:20px 4%">Erro ao carregar projetos: ${e.message}</p>`
    }
}

loadProjects()

// Menu mobile full-screen
const btnMenu = document.getElementById('abrir-menu')
const menu = document.getElementById('menu-mobile')
const btnFechar = document.getElementById('fechar-menu')

btnMenu.addEventListener('click', () => {
    menu.classList.add('abrir-menu')
    document.body.style.overflow = 'hidden'
})

function fecharMenu() {
    menu.classList.remove('abrir-menu')
    document.body.style.overflow = ''
}

btnFechar.addEventListener('click', fecharMenu)

// Scroll suave para seção
function scrollParaSecao(idSecao) {
    fecharMenu()
    const el = document.getElementById(idSecao)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
}

// Header glassmorphism ao rolar
const header = document.getElementById('header')
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60)
})

// Animação de entrada por scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
    })
}, { threshold: 0.1 })

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))

// Efeito de digitação no hero
const phrases = ['mundo criativo.', 'código limpo.', 'próximo projeto.']
let phraseIndex = 0, charIndex = 0, isDeleting = false
const typedEl = document.querySelector('.typed-text')

function type() {
    if (!typedEl) return
    const current = phrases[phraseIndex]
    typedEl.textContent = isDeleting
        ? current.substring(0, charIndex - 1)
        : current.substring(0, charIndex + 1)
    isDeleting ? charIndex-- : charIndex++

    let speed = isDeleting ? 70 : 110
    if (!isDeleting && charIndex === current.length) {
        speed = 2200; isDeleting = true
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        phraseIndex = (phraseIndex + 1) % phrases.length
        speed = 400
    }
    setTimeout(type, speed)
}
type()

// GitHub API — projetos dinâmicos
const GITHUB_USER = 'WendellOttoni'
const REPO_IGNORE = []
let allRepos = []

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

        allRepos = repos.filter(r => !r.fork && !REPO_IGNORE.includes(r.name))

        grid.innerHTML = allRepos.map(repo => {
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

        grid.querySelectorAll('.project-card').forEach((card, i) => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-link')) openModal(allRepos[i])
            })
        })
    } catch (e) {
        grid.innerHTML = `<p style="color:#777;padding:40px">Erro ao carregar projetos: ${e.message}</p>`
    }
}
loadProjects()

// Modal de projeto
function openModal(repo) {
    const lang = repo.language || '—'
    const color = langColors[lang] || langColors.default

    document.getElementById('modal-title').textContent = repo.name
    document.getElementById('modal-desc').textContent = repo.description || 'Sem descrição.'
    document.getElementById('modal-badges').innerHTML = `
        <span class="badge" style="--lang-color:${color}">${lang}</span>
        ${repo.stargazers_count > 0 ? `<span class="badge badge-star"><i class="bi bi-star-fill"></i> ${repo.stargazers_count}</span>` : ''}
        ${repo.forks_count > 0 ? `<span class="badge"><i class="bi bi-git"></i> ${repo.forks_count} forks</span>` : ''}
    `
    document.getElementById('modal-stats').innerHTML = `
        <span><i class="bi bi-eye"></i> ${repo.watchers_count} watchers</span>
        ${repo.license ? `<span><i class="bi bi-file-text"></i> ${repo.license.spdx_id}</span>` : ''}
    `
    document.getElementById('modal-link').href = repo.html_url

    const overlay = document.getElementById('modal-overlay')
    overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active')
    document.body.style.overflow = ''
}

document.getElementById('modal-close')?.addEventListener('click', closeModal)
document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal()
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
})

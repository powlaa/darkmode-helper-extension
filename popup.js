const btn = document.getElementById('toggle'),
    sun = document.getElementById('sun'),
    moon = document.getElementById('moon')

const setDarkMode = async (darkMode) => {
    moon.classList.toggle('hidden', darkMode)
    sun.classList.toggle('hidden', !darkMode)
}

chrome.tabs.query({ active: true, currentWindow: true }).then(async (tabs) => {
    const res = await chrome.tabs.sendMessage(tabs[0].id, { message: 'getDarkMode' })

    if (!res || res.dark === undefined) return
    setDarkMode(res.dark)
})

btn.addEventListener('click', async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const res = await chrome.tabs.sendMessage(tabs[0].id, { message: 'toggleDarkMode' })

    if (!res || res.dark === undefined) return
    setDarkMode(res.dark)
})

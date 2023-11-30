import './main.css'

const getDarkMode = async (hostname) => {
    const res = await chrome.storage.sync.get(['pages'])
    if (chrome.runtime.lastError) return
    return !!res.pages.find((page) => page === hostname)
}

const toggleDarkMode = async (hostname) => {
    const res = await chrome.storage.sync.get(['pages'])
    if (chrome.runtime.lastError) return

    const dark = res.pages && res.pages.find((page) => page === hostname)
    const pages = dark ? res.pages.filter((page) => page !== hostname) : [...res.pages, hostname]

    await chrome.storage.sync.set({ pages })
    if (chrome.runtime.lastError) return
    document.documentElement.classList.toggle('darkModeHelper--dark', !dark)
    return !dark
}

document.documentElement.classList.add('darkModeHelper')
getDarkMode(window.location.hostname).then((dark) => dark !== undefined && document.documentElement.classList.toggle('darkModeHelper--dark', dark))

chrome.runtime.onMessage.addListener(({ message }, _, sendResponse) => {
    if (message === 'getDarkMode') getDarkMode(window.location.hostname).then((dark) => sendResponse({ dark: dark }))
    else if (message === 'toggleDarkMode') toggleDarkMode(window.location.hostname).then((dark) => sendResponse({ dark: dark }))

    return true
})

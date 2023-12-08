let playerPosition = {}

document.addEventListener('keydown', (e) => {
    playerPosition[e.key] = true
})

document.addEventListener('keyup', (e) => {
    playerPosition[e.key] = false
})
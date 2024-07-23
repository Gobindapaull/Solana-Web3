async function getLatestTokens() {
    const response = await fetch("https://api.solanatracker.io/tokens/latest")
    const tokens = await response.json()
    return tokens
}

const bot = async () => {

    const tokenss = await getLatestTokens()

    for (const token of tokenss) {
        const createdAt = new Date(token.createdAt)
        console.log(createdAt)

        console.log(`Token name : ${token.name}`)
        console.log(`Token address : ${token.tokenAddress}`)
        console.log(`-------------------@autoboyt-------------------`)
        
        await new Promise((resolve) => setTimeout(resolve, 5000))
    }

}

bot()

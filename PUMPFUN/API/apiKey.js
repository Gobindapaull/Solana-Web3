// pump fun api key generate

const main = async () => {
    const response = await fetch("https://pumpportal.fun/api/create-wallet", {
        method: "GET"
    })
    
    const data = await response.json()
    console.log(data)
}

main()

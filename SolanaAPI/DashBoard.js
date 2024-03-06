import { useMoralisSolanaApi } from "react-moralis"
import { useState } from 'react'

export default function Dashboard({logout, user}) {

    let walletAddress = user.get('solAddress')
    // console.log(walletAddress)
    let solanaApi = useMoralisSolanaApi()
    let [ solanaBalance, setSolanaBalance ] = useState()
    let [ splToken, setSplToken ] = useState([{}])
    let [ nftsBalance, setNftsBalance ] = useState([{}])
    let [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            // solance balance
            try {
                let result = await solanaApi.account.balance({
                    network: 'devnet',
                    address: walletAddress
                })
                // console.log(result)
                solanaBalance(result.solana)
            } catch (error) {
                console.log(error)
            }
            // SPL tokens
            try {
                let result = solanaApi.account.getSPL({
                    network: 'devnet',
                    address: walletAddress
                })
                // console.log(result)
                setSplToken(result)
            } catch (error) {
                console.log(error)
            }
            // get NFTS
            try {
                let result = await solanaApi.account.getNFTs({
                    network: 'devnet',
                    address: walletAddress
                })
                // console.log(result)
                setNftsBalance(result)
            } catch (error) {
                console.log(error)
            }
            isLoading(false)
        }
        fetchData()
    }, [])

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center py-10 px-4 bg-black overflow-auto">
            <button onClick={logout} className="text-white self-end">logout</button>

            <p className="text-white font-bold text-xl md:text-3xl">wallet address</p>
            <p className="text-white mt-2 mb-8 text-[0.6rem] md:text-lg">{walletAddress}</p>

            <div className="w-full h-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-[#f97316] rounded-2xl drop-shadow-md px-2 py-2 md:px-4 md:py-4 md:text-lg">
                    <p className="text-2xl md:text-4xl">solana balance</p>
                   {!isLoading &&  <p className="mt-4 md:mt-10 text-3xl md:text-6xl">{solanaBalance.slice(0, 4)} <span>SOL</span></p>}
                </div>
                <div className="bg-white rounded-2xl drop-shadow-md px-2 py-2 md:px-4 md:py-4 md:text-lg">
                    <p className="text-2xl md:text-4xl">spl tokens {!isLoading ? splBalance.length : ''} </p>
                    <ul className="list-disc ml-8 mt-4 md:mt-10 text-md md:text-lg">
                        {splBalance.length > 0 && !isLoading && splBalance.map((spl, i) => {
                            <li key={i} >
                                {spl.mint?.slice(0, 10)} ... {''} {spl.amount}
                            </li>
                        })}
                    </ul>
                </div>
                <div className="bg-green md:col-span-2 rounded-2xl drop-shadow-md px-2 py-2 md:px-4 md:py-4 md:text-lg">
                    <p className="text-2xl md:text-4xl">nfts {!isLoading ? nftsBalance.length : ''}</p>
                    <ul className="list-disc px-4 mt-4 md:mt-10 text-md md:text-lg">
                        {nftsBalance.length > 0 && !isLoading && nftsBalance.map((nft, i) => {
                            <li className="text-ellipsis overflow-hidden" key={i} >
                                {nft.mint}
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

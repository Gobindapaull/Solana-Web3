export default function Auth({authenticate}) {
  const phantomAuth = async () => {
    try {
      await authenticate({
        type: 'sol'
      })
    } catch (error) {
      console.log(error)
    }
  }
    return(
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green to-purple">
          <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-7xl">solDashboard</h1>
          <button onClick={phantomAuth} className="flex items-center justify-center bg-blue text-white px-2 py-1 mt-3 md:text-xl lg:text-3xl hover:bg-darkBlue drop-shadow-xl hover:drop-shadow-2xl transition duration-150 ease-out"><img className="w-10 md:w-14 h-10 md:h-14 mr-4" src="/images/phantom.png" />auth with phantom</button>
      </div>
    )
}

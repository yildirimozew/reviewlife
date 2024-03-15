export default function Page(){
    return(
        <div className="flex justify-center h-screen bg-green-100">
            <div className="flex-shrink">left</div>
            <div className="w-2/3">
                <div id="wholeMenu" className="l-1/3 rounded border-green">
                    <img src="logo.png" alt="Logo" className="w-200 h-20 m-auto mt-10 mb-10 block" />
                    <div className="flex l-1 justify-around ">
                        <a href="#"><img src="like.png" alt="Image" className="inline w-64 h-auto"/></a>
                        <a href="#"><img src="dislike.png" alt="Image" className="inline w-64 h-auto"/></a>
                    </div>
                    <input type="text" placeholder="Please enter your review of life" className="w-full p-10 mt-20 bg-green-300 border-2 rounded border-black"></input>
                    <div className="flex justify-center">
                        <button className="bg-white rounded w-32 h-8 m-auto mt-3">Send</button>
                    </div>
                </div>
                <div>
                    otherMessages
                </div>
            </div>
            <div className="flex-shrink">right</div>
        </div>
    )
}
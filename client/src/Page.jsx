import { useEffect, useState } from "react"
import { UserContextProvider } from "./UserContext";

export default function Page(){
    const[reviewText, setReviewText] = useState("");
    const [ws, setWs] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [opinion, setOpinion] = useState("");
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:4000");
        setWs(ws);
        ws.addEventListener("message", handleMessage);
    }, []);

    function handleMessage(ev){
        const {review, opinion, senderId, senderName} = JSON.parse(ev.data);
        setReviews(prev => [...prev, {review: review, opinion: opinion, senderId: senderId, senderName: senderName}]);
    }

    function sendReview(ev){
        ev.preventDefault();
        if(reviewText != "" && opinion != ""){
            ws.send(JSON.stringify({
                review : reviewText,
                opinion : opinion
            }));
            setReviewText("");
        }
    }
    /*add long text wrap*/
    return(
        <div className="flex justify-center h-screen bg-green-100">
            <div className="flex-shrink">left</div>
            <div className="w-2/3">
            <img src="logo.png" alt="Logo" className="w-200 h-20 m-auto mt-10 mb-10 block" />
                <form className="l-1/3 rounded border-green" onSubmit={sendReview}>
                    <div className="flex l-1 justify-around ">
                        <a><img src="like.png" alt="Image" onClick={() => setOpinion("like")} className={"inline w-64 h-auto " + (opinion == "like" ? "border-8" : "")}/></a>
                        <a><img src="dislike.png" alt="Image" onClick={() => setOpinion("dislike")} className={"inline w-64 h-auto " + (opinion == "dislike" ? "border-8" : "")}/></a>
                    </div>
                    <input type="text" value={reviewText} onChange={ev => setReviewText(ev.target.value)} placeholder="Please enter your review of life" className="w-full p-10 mt-20 bg-green-300 border-2 rounded border-black"></input>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-white rounded w-32 h-8 m-auto mt-3 mb-3">Send</button>
                    </div>
                </form>
                <div className="flex flex-wrap gap-8">
                    {reviews.map(review => (
                        <div>
                            <div>{review.senderName}</div>
                            <div className={"p-8 w-full border-8 " + (review.opinion == "dislike" ? "border-red-200" : "border-green-200")}>
                                {review.review}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-shrink">right</div>
        </div>
    )
}
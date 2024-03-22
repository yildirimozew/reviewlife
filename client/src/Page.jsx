import { useEffect, useState } from "react"
import { uniqBy, reverse } from "lodash"
import axios from "axios";

export default function Page({id}){
    const[reviewText, setReviewText] = useState("");
    const [ws, setWs] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [opinion, setOpinion] = useState("");
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:4000");
        setWs(ws);
        ws.addEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        axios.get("/reviews").then(response => {
            //get sender's username
            // resolve id conflict
            // implement pageSize
            setReviews(response.data);
        })
    }, [])

    function handleMessage(ev){
        const reviewData = JSON.parse(ev.data);
        setReviews(prev => uniqBy([{...reviewData}, ...prev], "id"));
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
        <div className="flex justify-center min-h-screen bg-fixed bg-green-100">
            <div className="flex-shrink">left</div>
            <div className="w-2/3">
            <img src="logo.png" alt="Logo" className="w-200 h-20 m-auto mt-10 mb-10 block" />
                <form className="rounded border-green" onSubmit={sendReview}>
                    <div className="flex l-1 justify-around ">
                        <a><img src="like.png" alt="Image" onClick={() => setOpinion("like")} className={"inline w-32 h-auto " + (opinion == "like" ? "border-8" : "")}/></a>
                        <a><img src="dislike.png" alt="Image" onClick={() => setOpinion("dislike")} className={"inline w-32 h-auto " + (opinion == "dislike" ? "border-8" : "")}/></a>
                    </div>
                    <input type="text" value={reviewText} onChange={ev => setReviewText(ev.target.value)} placeholder="Please enter your review of life" className="w-full p-10 mt-10 bg-green-300 border-2 rounded border-black"></input>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-white rounded w-32 h-8 m-auto mt-3 mb-3">Send</button>
                    </div>
                </form>
                    <div className="flex flex-wrap gap-8">
                        {reviews.map(review => (
                            <div className="w-full">
                                <div className={"p-1 w-fit border-2 " + (review.senderId == id ? "border-yellow-200" : "border-black")}>{review.senderId == id ? "Me" : review.senderName}</div>
                                <div className={"p-8 border-8 " + (review.opinion == "dislike" ? "border-red-200" : "border-green-200")}>
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
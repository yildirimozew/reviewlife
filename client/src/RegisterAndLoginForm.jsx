import { useContext, useState } from "react"
import axios from "axios";
import { UserContext } from "./UserContext";

export default function RegisterAndLoginForm(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);
    const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");
    async function handleSubmit(ev){
        ev.preventDefault();
        const url = isLoginOrRegister === "register" ? "register" : "login";
        const { data } = await axios.post(url, { username, password }, { withCredentials: true });
        setLoggedInUsername(username);
        setId(data.id);
    }
    return(
        <div className="bg-green-100 h-screen flex items-center">
            <form className="w-64 mx-auto mb-28" onSubmit={handleSubmit}>
                <input value={username} onChange={ev => setUsername(ev.target.value)} type="text" placeholder="username" className="block w-full rounded-sm p-2 mb-3 border"/>
                <input value={password} onChange={ev => setPassword(ev.target.value)} type="password" placeholder="password" className="block w-full rounded-sm p-2 mb-3 border"/>
                <button className="bg-green-400 text-white block w-full rounded p-2">
                    {isLoginOrRegister === "register" ? "Register" : "Login"}
                    </button>
                <div className="text-center mt-2">
                    {isLoginOrRegister === "register" && (
                        <div>
                            <button onClick={() => setIsLoginOrRegister("login")}>
                            Already a member? Log in here
                            </button>
                        </div>
                    )}
                    {isLoginOrRegister === "login" && (
                        <div>
                            <button onClick={() => setIsLoginOrRegister("register")}>
                            Don't have an account? Register
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
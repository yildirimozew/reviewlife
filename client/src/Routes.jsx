import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { UserContext } from "./UserContext";
import Page from "./Page";

export default function Routes(){
    const {username, id} = useContext(UserContext);
    if(username){
        return(
            <Page></Page>
        )
    }
    return(
        <RegisterAndLoginForm></RegisterAndLoginForm>
    )
}
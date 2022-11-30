import { useSelector } from "react-redux";
import { authSelector } from "../Auth/AuthSlice";

export default function Header() {
    const authDetails=useSelector(authSelector);
    return (
        <div style={{width: "100%", height: "60px", backgroundColor: "#0064BF", display: "flex", position: "sticky", top: 0, zIndex: 100}}>
            <div style={{color: "white", alignSelf: "center", marginLeft: "16px", fontWeight: "500", fontSize: "20px", width: "100%"}}>
                QueryViz
            </div>
            {authDetails.loginResult && 
            <div style={{color: "white", alignSelf: "center", marginRight: "16px", fontWeight: "500", fontSize: "20px"}}>
                {authDetails.userName}
            </div>}
        </div>
    );
}
import useLogin from "./login/useLogin";
import UploadWindow from "./uploadWindow/UploadWindow";

export default function ToolSection() {
    const {isLoggedIn} = useLogin();
    if(!isLoggedIn) return 
    return <div>
        <h3>Tools</h3>
        <ul>
            <UploadWindow />
            {/* TO DO */}
            <li><a href="/CreateFrame">Create Border/Frame</a></li>
        </ul>
    </div>
}
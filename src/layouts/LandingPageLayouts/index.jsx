import { Outlet } from 'react-router-dom';
import Navbar from '../../Pages/Navbar';

// ─── Coordinator colour tokens (mirrors CoordinatorPage / constants/data C) ──
const C = {
    bg: "#0b0f1a",
    navy: "#0f1629",
    teal: "#0bb5a0",
    tealL: "#2eefd8",
    border: "rgba(255,255,255,0.08)",
    slate: "#7a8599",
    slateL: "#a0aec0",
    white: "#f0f4ff",
    red: "#e04c52",
};

const LandingPageLayout = () => {
    return (
        <div style={{ minHeight: '100vh', background: "white", color: C.black }} className='llllllllllllllll'>
            <Navbar />
            <main style={{ padding: '28px 0px' }}>
                <Outlet />
            </main>
        </div>
    );
};
export default LandingPageLayout;
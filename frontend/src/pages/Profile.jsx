import usePageTitle from "../util/pageTitle";
import {useAuth} from "../context/AuthContext.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function Activity() {
    usePageTitle("Weryfikator Fachowca - Profil fachowca");

    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const isSpecialist = user?.role === "SPECIALIST";

    useEffect(() => {
        if (!loading && user && !isSpecialist) {
            navigate("/dashboard", { replace: true });
        }
    }, [loading, user, isSpecialist, navigate]);

    if (loading || !user || !isSpecialist) return null;

    return (
        <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
            profil fachowca
        </div>
    );
}

export default Activity;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ui/ProfileCard";
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Stars from "../components/ui/Stars";
import usePageTitle from "../util/pageTitle";

export default function SpecialistProfile() {
    usePageTitle("Profil fachowca - Weryfikator Fachowca");
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSpecialist() {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                };

                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const res = await fetch(`/api/profile/${id}`, {
                    method: "GET",
                    headers,
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("Nie znaleziono profilu fachowca.");
                    }
                    throw new Error("Wystąpił błąd podczas pobierania danych z serwera.");
                }

                const fetchedData = await res.json();
                setData(fetchedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSpecialist();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-neutral-400">
                Ładowanie profilu...
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20 p-6 mt-10">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 py-10">
            <ProfileCard
                data={{
                    profile: data.profile || data,
                    user: data.user || data,
                }}
            />

            <Section title="Opinie użytkowników">
                <div className="flex flex-col gap-3">
                    <Card className="flex flex-col gap-5">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar name="MN" />
                                <span className="text-neutral-200 font-medium">Michał Nowak</span>
                            </div>
                            <Stars value={5} interactive={false} />
                        </div>

                        <div className="flex flex-col">
                            <p className="mt-2 text-neutral-400 leading-relaxed">
                                Szybko, sprawnie i profesjonalnie. Usługa wykonana na najwyższym poziomie, brak jakichkolwiek zastrzeżeń. Fachowiec po sobie posprzątał. Polecam w 100%!
                            </p>
                            <p className="mt-2 text-neutral-500 text-xs">2 dni temu</p>
                        </div>
                    </Card>

                    <Card className="flex flex-col gap-5">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar name="AW" />
                                <span className="text-neutral-200 font-medium">Anna Wiśniewska</span>
                            </div>
                            <Stars value={4} interactive={false} />
                        </div>

                        <div className="flex flex-col">
                            <p className="mt-2 text-neutral-400 leading-relaxed">
                                Wszystko poprawnie, świetny kontakt z fachowcem. Jedyny mały minus za drobne opóźnienie, ale praca wykonana bardzo dobrze. Ceny rozsądne.
                            </p>
                            <p className="mt-2 text-neutral-500 text-xs">Tydzień temu</p>
                        </div>
                    </Card>
                </div>
            </Section>
        </div>
    );
}
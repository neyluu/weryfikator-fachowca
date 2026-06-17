import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Stars from "../components/ui/Stars";
import usePageTitle from "../util/pageTitle";

const SORT_OPTIONS = [
    { value: "rating-desc", label: "Najwyżej oceniane" },
    { value: "price-asc",   label: "Cena: od najniższej" },
    { value: "price-desc",  label: "Cena: od najwyższej" },
];

const getSortPrice = (prices) => {
    if (prices?.hourly?.enabled)       return prices.hourly.value.min;
    if (prices?.project?.enabled)      return prices.project.value.min;
    if (prices?.consultation?.enabled) return prices.consultation.value.min;
    return 0;
};

const getPriceLabel = (prices) => {
    if (prices?.hourly?.enabled)       return `od ${prices.hourly.value.min} zł / h`;
    if (prices?.project?.enabled)      return `Wycena od ${prices.project.value.min} zł`;
    if (prices?.consultation?.enabled) return `Konsultacja: ${prices.consultation.value.min} zł`;
    return "Do ustalenia";
};

export default function SearchResults() {
    usePageTitle("Wyniki wyszukiwania - Weryfikator Fachowca");

    const [searchParams] = useSearchParams();
    const [sortOption, setSortOption]   = useState("rating-desc");
    const [results, setResults]         = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);

    const cityQuery    = searchParams.get("city")    || "";
    const serviceQuery = searchParams.get("service") || "";

    useEffect(() => {
        const params = new URLSearchParams();
        if (serviceQuery) params.set("service", serviceQuery);
        if (cityQuery)    params.set("city",    cityQuery);

        setLoading(true);
        setError(null);

        fetch(`/api/profile/search?${params.toString()}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setResults(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd wyszukiwania:", err);
                setError("Nie udało się pobrać wyników. Spróbuj ponownie.");
                setLoading(false);
            });
    }, [serviceQuery, cityQuery]);

    const sortedResults = useMemo(() => {
        const copy = [...results];
        if (sortOption === "rating-desc") {
            copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        } else if (sortOption === "price-asc") {
            copy.sort((a, b) => getSortPrice(a.prices) - getSortPrice(b.prices));
        } else if (sortOption === "price-desc") {
            copy.sort((a, b) => getSortPrice(b.prices) - getSortPrice(a.prices));
        }
        return copy;
    }, [results, sortOption]);

    const titleText    = [serviceQuery, cityQuery].filter(Boolean).join(" w ");
    const displayTitle = titleText ? `Wyniki dla: ${titleText}` : "Wszyscy specjaliści";

    return (
        <div className="flex flex-col gap-8 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-medium text-neutral-100">
                        {displayTitle}
                    </h1>
                    <h2 className="text-lg text-neutral-500">
                        {loading
                            ? "Wyszukiwanie…"
                            : `Znaleziono ${sortedResults.length} fachowców`}
                    </h2>
                </div>

                <div className="w-full md:w-64">
                    <Select
                        name="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        options={SORT_OPTIONS}
                        placeholder="Sortuj wyniki"
                    />
                </div>
            </div>

            {/* Stan ładowania */}
            {loading && (
                <div className="flex justify-center py-20">
                    <span className="text-neutral-500">Ładowanie wyników…</span>
                </div>
            )}

            {/* Błąd */}
            {!loading && error && (
                <div className="flex justify-center py-20">
                    <span className="text-red-400">{error}</span>
                </div>
            )}

            {/* Brak wyników */}
            {!loading && !error && sortedResults.length === 0 && (
                <div className="flex justify-center py-20">
                    <span className="text-neutral-500">
                        Nie znaleziono fachowców spełniających kryteria.
                    </span>
                </div>
            )}

            {/* Lista wyników */}
            {!loading && !error && sortedResults.length > 0 && (
                <div className="flex flex-col gap-4">
                    {sortedResults.map((specialist) => (
                        <Card
                            key={specialist.id}
                            className="flex flex-col sm:flex-row gap-6 justify-between items-start"
                        >
                            <div className="flex flex-row gap-4 items-start flex-1">
                                <Avatar
                                    name={`${specialist.firstName?.[0] ?? "?"}${specialist.lastName?.[0] ?? ""}`}
                                />

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-xl font-medium text-neutral-200">
                                            {specialist.firstName} {specialist.lastName}
                                        </span>
                                        {specialist.rating != null && (
                                            <Stars value={specialist.rating} interactive={false} />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                                        <span>{specialist.specialization}</span>
                                        {specialist.city && (
                                            <>
                                                <span>•</span>
                                                <span>{specialist.city}</span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-neutral-400 mt-1 max-w-3xl leading-relaxed">
                                        {specialist.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start sm:items-end gap-4 sm:min-w-[150px] w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-neutral-800 sm:border-0">
                                <div className="flex flex-col sm:items-end">
                                    <span className="text-xs text-neutral-500 mb-1">Cena usługi</span>
                                    <span className="text-xl font-semibold text-neutral-200 whitespace-nowrap">
                                        {getPriceLabel(specialist.prices)}
                                    </span>
                                </div>

                                <Button
                                    href={`/specialist/${specialist.id}`}
                                    className="w-full sm:w-auto"
                                >
                                    Zobacz profil
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
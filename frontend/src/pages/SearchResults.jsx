import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Stars from "../components/ui/Stars";
import usePageTitle from "../util/pageTitle";

const SORT_OPTIONS = [
    { value: "rating-desc", label: "Najwyżej oceniane" },
    { value: "price-asc", label: "Cena: od najniższej" },
    { value: "price-desc", label: "Cena: od najwyższej" },
];

const MOCK_RESULTS = [
    {
        id: "1",
        firstName: "Jan",
        lastName: "Kowalski",
        rating: 5,
        specialization: "Elektryk",
        description: "Wykonuję kompleksowe instalacje elektryczne oraz usuwam nagłe awarie. Wieloletnie doświadczenie i uprawnienia SEP.",
        experience: "10 lat",
        localization: "Warszawa",
        phoneNumber: "123456789",
        email: "jan.kowalski@example.com",
        profilePicture: "",
        prices: {
            consultation: { enabled: false, value: { min: 0, max: 0 } },
            hourly: { enabled: true, value: { min: 150, max: 200 } },
            project: { enabled: false, value: { min: 0, max: 0 } },
        },
        images: [],
        availability: [],
        categories: ["instalacja-elektryczna"],
    },
    {
        id: "2",
        firstName: "Anna",
        lastName: "Malinowska",
        rating: 4,
        specialization: "Projektantka wnętrz",
        description: "Tworzę funkcjonalne i estetyczne projekty mieszkań oraz lokali usługowych. Pomagam w doborze materiałów.",
        experience: "5 lat",
        localization: "Kraków",
        phoneNumber: "987654321",
        email: "anna.malinowska@example.com",
        profilePicture: "",
        prices: {
            consultation: { enabled: true, value: { min: 250, max: 300 } },
            hourly: { enabled: false, value: { min: 0, max: 0 } },
            project: { enabled: true, value: { min: 2000, max: 5000 } },
        },
        images: [],
        availability: [],
        categories: ["remont-mieszkania", "malowanie-scian"],
    },
    {
        id: "3",
        firstName: "Piotr",
        lastName: "Szymański",
        rating: 5,
        specialization: "Hydraulik",
        description: "Szybkie naprawy i instalacje wodno-kanalizacyjne. Dostępność 24/7 w nagłych przypadkach.",
        experience: "8 lat",
        localization: "Warszawa",
        phoneNumber: "111222333",
        email: "piotr.szymanski@example.com",
        profilePicture: "",
        prices: {
            consultation: { enabled: false, value: { min: 0, max: 0 } },
            hourly: { enabled: true, value: { min: 120, max: 180 } },
            project: { enabled: false, value: { min: 0, max: 0 } },
        },
        images: [],
        availability: [],
        categories: ["remont-mieszkania"],
    },
    {
        id: "4",
        firstName: "Marek",
        lastName: "Zieliński",
        rating: 3,
        specialization: "Glazurnik",
        description: "Precyzyjne układanie płytek, gresu i terakoty. Dokładność i terminowość to moje priorytety.",
        experience: "12 lat",
        localization: "Poznań",
        phoneNumber: "444555666",
        email: "marek.zielinski@example.com",
        profilePicture: "",
        prices: {
            consultation: { enabled: false, value: { min: 0, max: 0 } },
            hourly: { enabled: false, value: { min: 0, max: 0 } },
            project: { enabled: true, value: { min: 800, max: 3000 } },
        },
        images: [],
        availability: [],
        categories: ["ukladanie-plytek", "remont-mieszkania"],
    },
];

const getSortPrice = (prices) => {
    if (prices?.hourly?.enabled) return prices.hourly.value.min;
    if (prices?.project?.enabled) return prices.project.value.min;
    if (prices?.consultation?.enabled) return prices.consultation.value.min;
    return 0;
};

const getPriceLabel = (prices) => {
    if (prices?.hourly?.enabled) return `od ${prices.hourly.value.min} zł / h`;
    if (prices?.project?.enabled) return `Wycena od ${prices.project.value.min} zł`;
    if (prices?.consultation?.enabled) return `Konsultacja: ${prices.consultation.value.min} zł`;
    return "Do ustalenia";
};

export default function SearchResults() {
    usePageTitle("Wyniki wyszukiwania - Weryfikator Fachowca");
    const [searchParams] = useSearchParams();
    const [sortOption, setSortOption] = useState("rating-desc");

    const cityQuery = searchParams.get("city") || "";
    const serviceQuery = searchParams.get("service") || "";

    const titleText = [serviceQuery, cityQuery].filter(Boolean).join(" w ");
    const displayTitle = titleText ? `Wyniki dla: ${titleText}` : "Wszyscy specjaliści";

    const sortedResults = useMemo(() => {
        const results = [...MOCK_RESULTS];

        if (sortOption === "rating-desc") {
            results.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === "price-asc") {
            results.sort((a, b) => getSortPrice(a.prices) - getSortPrice(b.prices));
        } else if (sortOption === "price-desc") {
            results.sort((a, b) => getSortPrice(b.prices) - getSortPrice(a.prices));
        }

        return results;
    }, [sortOption]);

    return (
        <div className="flex flex-col gap-8 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-medium text-neutral-100">
                        {displayTitle}
                    </h1>
                    <h2 className="text-lg text-neutral-500">
                        Znaleziono {sortedResults.length} fachowców
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

            <div className="flex flex-col gap-4">
                {sortedResults.map((specialist) => (
                    <Card key={specialist.id} className="flex flex-col sm:flex-row gap-6 justify-between items-start">
                        <div className="flex flex-row gap-4 items-start flex-1">
                            <Avatar name={`${specialist.firstName[0]}${specialist.lastName[0]}`} />

                            <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xl font-medium text-neutral-200">
                    {specialist.firstName} {specialist.lastName}
                  </span>
                                    <Stars value={specialist.rating} interactive={false} />
                                </div>

                                <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                                    <span>{specialist.specialization}</span>
                                    <span>•</span>
                                    <span>{specialist.localization}</span>
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

                            <Button href={`/specialist/${specialist.id}`} className="w-full sm:w-auto">
                                Zobacz profil
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
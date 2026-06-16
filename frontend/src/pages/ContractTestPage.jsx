import usePageTitle from "../util/pageTitle";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import TextArea from "../components/ui/TextArea.jsx";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONTRACT_TYPES = [
  {
    value: "UMOWA_ZLECENIE",
    label: "Umowa zlecenie",
    hint: "Czynności prawne i faktyczne, np. usługi, doradztwo",
  },
  {
    value: "UMOWA_O_DZIELO",
    label: "Umowa o dzieło",
    hint: "Konkretne, mierzalne dzieło",
  },
];

const ORDERER_TYPES = [
  { value: "PERSON", label: "Osoba fizyczna" },
  { value: "COMPANY", label: "Firma / Spółka" },
];

const INITIAL_FORM = {
  contractType: "UMOWA_ZLECENIE",
  ordererType: "PERSON",

  ordererFullName: "",
  ordererPesel: "",
  ordererIdNumber: "",
  ordererAddress: "",
  ordererCity: "",
  ordererPostalCode: "",

  ordererCompanyName: "",
  ordererNip: "",
  ordererRegon: "",
  ordererKrs: "",
  ordererRepresentativeName: "",
  ordererRepresentativeTitle: "",

  specialistFullName: "",
  specialistPesel: "",
  specialistIdNumber: "",
  specialistAddress: "",
  specialistCity: "",
  specialistPostalCode: "",
  specialistEmail: "",
  specialistPhone: "",

  subjectDescription: "",
  remunerationAmount: "",
  remunerationCurrency: "PLN",
  completionDeadline: "",
  paymentDeadline: "",
  contractPlace: "",
  contractDate: "",
};

// ---------------------------------------------------------------------------
// Small reusable field components
// ---------------------------------------------------------------------------

function FieldGroup({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-gray-600 text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      {children}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest pt-2">
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="border-t border-neutral-800 my-1" />;
}

// ---------------------------------------------------------------------------
// Contract list item
// ---------------------------------------------------------------------------

function ContractRow({ contract, onDownload, isDownloading }) {
  const typeLabel =
    contract.contractType === "UMOWA_ZLECENIE" ? "Zlecenie" : "Dzieło";

  const formattedDate = new Date(contract.generatedAt).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-neutral-800/25 border border-neutral-800 rounded-2xl group hover:border-neutral-700 transition-colors">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-neutral-100 text-sm">
            {contract.contractType === "UMOWA_ZLECENIE"
              ? "Umowa zlecenie"
              : "Umowa o dzieło"}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-brand border border-brand text-xs">
            {typeLabel}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-neutral-500">
          <span>
            Zleceniobiorca:{" "}
            <span className="text-neutral-400">
              {contract.specialistFullName}
            </span>
          </span>
          <span>
            Zleceniodawca:{" "}
            <span className="text-neutral-400">
              {contract.ordererDisplayName}
            </span>
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDownload(contract.id)}
        disabled={isDownloading}
        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:border-brand hover:text-brand disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isDownloading ? "Pobieranie..." : "Pobierz PDF"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ContractTestPage() {
  usePageTitle("Weryfikator Fachowca - Test: Umowy");

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const isAllowed = user?.role === "SPECIALIST" || user?.role === "ADMIN";

  const [contracts, setContracts] = useState([]);
  const [contractsLoading, setContractsLoading] = useState(true);
  const [contractsError, setContractsError] = useState("");

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [downloadingId, setDownloadingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  // Redirect if not allowed
  useEffect(() => {
    if (!loading && user && !isAllowed) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, user, isAllowed, navigate]);

  // Fetch contract list
  const fetchContracts = async () => {
    setContractsLoading(true);
    setContractsError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/specialist/contract/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        setContractsError("Nie udało się załadować listy umów.");
        return;
      }
      const data = await response.json();
      setContracts(data);
    } catch {
      setContractsError("Błąd połączenia z serwerem.");
    } finally {
      setContractsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && isAllowed) fetchContracts();
  }, [loading, isAllowed]);

  // Field helper
  const updateField = (field, value) =>
    setFormData((previous) => ({ ...previous, [field]: value }));

  // Validate before send
  const validate = () => {
    if (formData.ordererType === "PERSON") {
      if (!formData.ordererFullName.trim())
        return "Imię i nazwisko zleceniodawcy jest wymagane.";
      if (!formData.ordererPesel.trim())
        return "PESEL zleceniodawcy jest wymagany.";
      if (!formData.ordererAddress.trim())
        return "Adres zleceniodawcy jest wymagany.";
      if (!formData.ordererCity.trim())
        return "Miasto zleceniodawcy jest wymagane.";
    } else {
      if (!formData.ordererCompanyName.trim())
        return "Nazwa firmy jest wymagana.";
      if (!formData.ordererNip.trim()) return "NIP jest wymagany.";
      if (!formData.ordererRepresentativeName.trim())
        return "Imię i nazwisko reprezentanta jest wymagane.";
      if (!formData.ordererAddress.trim())
        return "Adres siedziby jest wymagany.";
      if (!formData.ordererCity.trim()) return "Miasto siedziby jest wymagane.";
    }
    if (!formData.specialistFullName.trim())
      return "Imię i nazwisko zleceniobiorcy jest wymagane.";
    if (!formData.subjectDescription.trim())
      return "Przedmiot umowy jest wymagany.";
    if (!formData.remunerationAmount.trim())
      return "Wynagrodzenie jest wymagane.";
    return null;
  };

  // Generate
  const handleGenerate = async () => {
    setFormError("");
    setFormSuccess("");

    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/specialist/contract/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setFormError(
          errorData.message || "Wystąpił błąd podczas generowania umowy.",
        );
        return;
      }

      const data = await response.json();
      setFormSuccess(`Umowa wygenerowana pomyślnie (ID: ${data.id}).`);
      setFormData(INITIAL_FORM);
      setShowForm(false);
      await fetchContracts();
    } catch {
      setFormError("Nie udało się połączyć z serwerem.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download
  const handleDownload = async (contractId) => {
    setDownloadingId(contractId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/specialist/contract/${contractId}/download`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) return;

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `umowa_${contractId}.pdf`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    } catch {
      // silent — user will see nothing happened and can retry
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading || !user || !isAllowed) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page header */}
      <div className="p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl flex items-center justify-between gap-4">
        <div>
          <p className="text-neutral-200 font-semibold">Umowy</p>
          <p className="text-neutral-500 text-sm mt-0.5">
            Generator umów zlecenie i o dzieło
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setShowForm((previous) => !previous);
            setFormError("");
            setFormSuccess("");
          }}
        >
          {showForm ? "Anuluj" : "Nowa umowa"}
        </Button>
      </div>

      {/* Success banner after generation */}
      {formSuccess && !showForm && (
        <p className="flex justify-center text-green-600 border-green-300 border-2 rounded-3xl p-3 bg-green-100 text-sm">
          {formSuccess}
        </p>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Generation form                                                      */}
      {/* ------------------------------------------------------------------ */}
      {showForm && (
        <div className="flex flex-col gap-5 p-6 bg-neutral-800/25 border border-neutral-800 rounded-3xl">
          <h2 className="text-neutral-200 font-semibold">Nowa umowa</h2>

          {/* Typ umowy */}
          <div className="flex flex-col gap-2">
            <SectionHeading>Rodzaj umowy</SectionHeading>
            <div className="grid grid-cols-2 gap-3">
              {CONTRACT_TYPES.map((type) => {
                const isActive = formData.contractType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateField("contractType", type.value)}
                    className={`flex flex-col gap-1 p-4 rounded-2xl border text-left transition-all ${
                      isActive
                        ? "bg-brand/10 border-brand"
                        : "bg-neutral-900 border-neutral-700 hover:border-neutral-500"
                    }`}
                  >
                    <span
                      className={`font-semibold text-sm ${isActive ? "text-neutral-100" : "text-neutral-300"}`}
                    >
                      {type.label}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {type.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* Zleceniodawca — typ */}
          <div className="flex flex-col gap-3">
            <SectionHeading>Zleceniodawca</SectionHeading>

            <div className="flex gap-2">
              {ORDERER_TYPES.map((type) => {
                const isActive = formData.ordererType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateField("ordererType", type.value)}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                      isActive
                        ? "bg-brand border-brand text-neutral-100"
                        : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {type.label}
                  </button>
                );
              })}
            </div>

            {formData.ordererType === "PERSON" ? (
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Imię i nazwisko" required>
                  <Input
                    type="text"
                    value={formData.ordererFullName}
                    onChange={(event) =>
                      updateField("ordererFullName", event.target.value)
                    }
                    placeholder="Jan Kowalski"
                  />
                </FieldGroup>
                <FieldGroup label="PESEL" required>
                  <Input
                    type="text"
                    value={formData.ordererPesel}
                    onChange={(event) =>
                      updateField("ordererPesel", event.target.value)
                    }
                    placeholder="00000000000"
                  />
                </FieldGroup>
                <FieldGroup label="Nr dowodu osobistego">
                  <Input
                    type="text"
                    value={formData.ordererIdNumber}
                    onChange={(event) =>
                      updateField("ordererIdNumber", event.target.value)
                    }
                    placeholder="ABC 123456"
                  />
                </FieldGroup>
                <FieldGroup label="Kod pocztowy">
                  <Input
                    type="text"
                    value={formData.ordererPostalCode}
                    onChange={(event) =>
                      updateField("ordererPostalCode", event.target.value)
                    }
                    placeholder="00-000"
                  />
                </FieldGroup>
                <FieldGroup label="Ulica i numer" required>
                  <Input
                    type="text"
                    value={formData.ordererAddress}
                    onChange={(event) =>
                      updateField("ordererAddress", event.target.value)
                    }
                    placeholder="Przykładowa 1/2"
                  />
                </FieldGroup>
                <FieldGroup label="Miasto" required>
                  <Input
                    type="text"
                    value={formData.ordererCity}
                    onChange={(event) =>
                      updateField("ordererCity", event.target.value)
                    }
                    placeholder="Warszawa"
                  />
                </FieldGroup>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <FieldGroup label="Nazwa firmy / spółki" required>
                    <Input
                      type="text"
                      value={formData.ordererCompanyName}
                      onChange={(event) =>
                        updateField("ordererCompanyName", event.target.value)
                      }
                      placeholder="Przykład Sp. z o.o."
                    />
                  </FieldGroup>
                </div>
                <FieldGroup label="NIP" required>
                  <Input
                    type="text"
                    value={formData.ordererNip}
                    onChange={(event) =>
                      updateField("ordererNip", event.target.value)
                    }
                    placeholder="0000000000"
                  />
                </FieldGroup>
                <FieldGroup label="REGON">
                  <Input
                    type="text"
                    value={formData.ordererRegon}
                    onChange={(event) =>
                      updateField("ordererRegon", event.target.value)
                    }
                    placeholder="000000000"
                  />
                </FieldGroup>
                <FieldGroup label="KRS">
                  <Input
                    type="text"
                    value={formData.ordererKrs}
                    onChange={(event) =>
                      updateField("ordererKrs", event.target.value)
                    }
                    placeholder="0000000000"
                  />
                </FieldGroup>
                <FieldGroup label="Kod pocztowy">
                  <Input
                    type="text"
                    value={formData.ordererPostalCode}
                    onChange={(event) =>
                      updateField("ordererPostalCode", event.target.value)
                    }
                    placeholder="00-000"
                  />
                </FieldGroup>
                <FieldGroup label="Adres siedziby" required>
                  <Input
                    type="text"
                    value={formData.ordererAddress}
                    onChange={(event) =>
                      updateField("ordererAddress", event.target.value)
                    }
                    placeholder="Przykładowa 1"
                  />
                </FieldGroup>
                <FieldGroup label="Miasto" required>
                  <Input
                    type="text"
                    value={formData.ordererCity}
                    onChange={(event) =>
                      updateField("ordererCity", event.target.value)
                    }
                    placeholder="Warszawa"
                  />
                </FieldGroup>
                <FieldGroup label="Imię i nazwisko reprezentanta" required>
                  <Input
                    type="text"
                    value={formData.ordererRepresentativeName}
                    onChange={(event) =>
                      updateField(
                        "ordererRepresentativeName",
                        event.target.value,
                      )
                    }
                    placeholder="Anna Nowak"
                  />
                </FieldGroup>
                <FieldGroup label="Stanowisko reprezentanta">
                  <Input
                    type="text"
                    value={formData.ordererRepresentativeTitle}
                    onChange={(event) =>
                      updateField(
                        "ordererRepresentativeTitle",
                        event.target.value,
                      )
                    }
                    placeholder="Prezes Zarządu"
                  />
                </FieldGroup>
              </div>
            )}
          </div>

          <Divider />

          {/* Zleceniobiorca */}
          <div className="flex flex-col gap-3">
            <SectionHeading>
              {formData.contractType === "UMOWA_ZLECENIE"
                ? "Zleceniobiorca"
                : "Wykonawca"}
            </SectionHeading>
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Imię i nazwisko" required>
                <Input
                  type="text"
                  value={formData.specialistFullName}
                  onChange={(event) =>
                    updateField("specialistFullName", event.target.value)
                  }
                  placeholder="Jan Kowalski"
                />
              </FieldGroup>
              <FieldGroup label="PESEL">
                <Input
                  type="text"
                  value={formData.specialistPesel}
                  onChange={(event) =>
                    updateField("specialistPesel", event.target.value)
                  }
                  placeholder="00000000000"
                />
              </FieldGroup>
              <FieldGroup label="Nr dowodu osobistego">
                <Input
                  type="text"
                  value={formData.specialistIdNumber}
                  onChange={(event) =>
                    updateField("specialistIdNumber", event.target.value)
                  }
                  placeholder="ABC 123456"
                />
              </FieldGroup>
              <FieldGroup label="Kod pocztowy">
                <Input
                  type="text"
                  value={formData.specialistPostalCode}
                  onChange={(event) =>
                    updateField("specialistPostalCode", event.target.value)
                  }
                  placeholder="00-000"
                />
              </FieldGroup>
              <FieldGroup label="Ulica i numer">
                <Input
                  type="text"
                  value={formData.specialistAddress}
                  onChange={(event) =>
                    updateField("specialistAddress", event.target.value)
                  }
                  placeholder="Przykładowa 1/2"
                />
              </FieldGroup>
              <FieldGroup label="Miasto">
                <Input
                  type="text"
                  value={formData.specialistCity}
                  onChange={(event) =>
                    updateField("specialistCity", event.target.value)
                  }
                  placeholder="Warszawa"
                />
              </FieldGroup>
              <FieldGroup label="Email">
                <Input
                  type="email"
                  value={formData.specialistEmail}
                  onChange={(event) =>
                    updateField("specialistEmail", event.target.value)
                  }
                  placeholder="jan@example.com"
                />
              </FieldGroup>
              <FieldGroup label="Telefon">
                <Input
                  type="text"
                  value={formData.specialistPhone}
                  onChange={(event) =>
                    updateField("specialistPhone", event.target.value)
                  }
                  placeholder="500 000 000"
                />
              </FieldGroup>
            </div>
          </div>

          <Divider />

          {/* Szczegóły umowy */}
          <div className="flex flex-col gap-3">
            <SectionHeading>Szczegóły umowy</SectionHeading>

            <FieldGroup label="Przedmiot umowy" required>
              <TextArea
                value={formData.subjectDescription}
                onChange={(event) =>
                  updateField("subjectDescription", event.target.value)
                }
                placeholder={
                  formData.contractType === "UMOWA_ZLECENIE"
                    ? "np. Świadczenie usług instalacji elektrycznej w lokalu przy ul. ..."
                    : "np. Wykonanie i montaż mebli kuchennych na wymiar według projektu ..."
                }
                className="p-3 rounded-xl bg-neutral-900 border border-neutral-700 min-h-24"
              />
            </FieldGroup>

            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Wynagrodzenie brutto" required>
                <Input
                  type="text"
                  value={formData.remunerationAmount}
                  onChange={(event) =>
                    updateField("remunerationAmount", event.target.value)
                  }
                  placeholder="3000"
                />
              </FieldGroup>
              <FieldGroup label="Waluta">
                <Input
                  type="text"
                  value={formData.remunerationCurrency}
                  onChange={(event) =>
                    updateField("remunerationCurrency", event.target.value)
                  }
                  placeholder="PLN"
                />
              </FieldGroup>
              <FieldGroup
                label={
                  formData.contractType === "UMOWA_ZLECENIE"
                    ? "Termin wykonania zlecenia"
                    : "Termin oddania dzieła"
                }
              >
                <Input
                  type="text"
                  value={formData.completionDeadline}
                  onChange={(event) =>
                    updateField("completionDeadline", event.target.value)
                  }
                  placeholder="np. 30.09.2025 lub do 3 miesięcy od podpisania"
                />
              </FieldGroup>
              <FieldGroup label="Termin płatności">
                <Input
                  type="text"
                  value={formData.paymentDeadline}
                  onChange={(event) =>
                    updateField("paymentDeadline", event.target.value)
                  }
                  placeholder="np. 14 dni od wystawienia rachunku"
                />
              </FieldGroup>
              <FieldGroup label="Miejsce zawarcia umowy">
                <Input
                  type="text"
                  value={formData.contractPlace}
                  onChange={(event) =>
                    updateField("contractPlace", event.target.value)
                  }
                  placeholder="np. Warszawa"
                />
              </FieldGroup>
              <FieldGroup label="Data zawarcia umowy">
                <Input
                  type="date"
                  value={formData.contractDate}
                  onChange={(event) =>
                    updateField("contractDate", event.target.value)
                  }
                />
              </FieldGroup>
            </div>
          </div>

          {formError && (
            <p className="flex justify-center text-red-600 border-red-300 border-2 rounded-3xl p-3 bg-red-100 text-sm">
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1"
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Generowanie..." : "Generuj umowę"}
            </Button>
            <Button
              className="flex-1"
              look="secondary"
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormError("");
                setFormData(INITIAL_FORM);
              }}
            >
              Anuluj
            </Button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Contract list                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-neutral-400 text-sm font-semibold uppercase tracking-widest">
            Wygenerowane umowy
          </h2>
          <button
            type="button"
            onClick={fetchContracts}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Odśwież
          </button>
        </div>

        {contractsLoading && (
          <p className="text-neutral-500 text-sm">Ładowanie...</p>
        )}

        {contractsError && (
          <p className="text-red-500 text-sm">{contractsError}</p>
        )}

        {!contractsLoading && !contractsError && contracts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-14 text-neutral-600">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm">Brak wygenerowanych umów</p>
          </div>
        )}

        {!contractsLoading &&
          contracts.map((contract) => (
            <ContractRow
              key={contract.id}
              contract={contract}
              onDownload={handleDownload}
              isDownloading={downloadingId === contract.id}
            />
          ))}
      </div>
    </div>
  );
}

import { useState } from "react";

const EXPERIENCE_TYPES = [
  { value: "maly_projekt", label: "Mały projekt" },
  { value: "duzy_projekt", label: "Duży projekt" },
  { value: "zatrudnienie", label: "Zatrudnienie" },
  { value: "wolontariat", label: "Wolontariat" },
];

const MONTHS = [
  { value: 1, label: "Styczeń" },
  { value: 2, label: "Luty" },
  { value: 3, label: "Marzec" },
  { value: 4, label: "Kwiecień" },
  { value: 5, label: "Maj" },
  { value: 6, label: "Czerwiec" },
  { value: 7, label: "Lipiec" },
  { value: 8, label: "Sierpień" },
  { value: 9, label: "Wrzesień" },
  { value: 10, label: "Październik" },
  { value: 11, label: "Listopad" },
  { value: 12, label: "Grudzień" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, index) => currentYear - index);

function toComparableDate(year, month) {
  if (!year || !month) return null;
  return Number(year) * 12 + Number(month);
}

const emptyEntry = {
  title: "",
  description: "",
  type: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isCurrent: false,
};

function monthLabel(monthNumber) {
  return MONTHS.find((month) => month.value === monthNumber)?.label ?? "";
}

function typeLabel(typeValue) {
  return (
    EXPERIENCE_TYPES.find((type) => type.value === typeValue)?.label ??
    typeValue
  );
}

function SelectField({ value, onChange, disabled, children, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-neutral-200 w-full focus:outline-none focus:border-neutral-500"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
}

function ExperienceForm({ entry, onChange, onSave, onCancel }) {
  const [localEntry, setLocalEntry] = useState(entry);

  const updateField = (field, value) => {
    setLocalEntry((previous) => ({ ...previous, [field]: value }));
  };

  const handleSave = () => {
    const { title, type, startMonth, startYear } = localEntry;

    if (!title.trim() || !type || !startMonth || !startYear) return;

    if (!localEntry.isCurrent && (!localEntry.endMonth || !localEntry.endYear))
      return;

    if (isDateInvalid) return;

    onSave(localEntry);
  };

  const isDateInvalid = (() => {
    if (localEntry.isCurrent) return false;

    const start = toComparableDate(localEntry.startYear, localEntry.startMonth);
    const end = toComparableDate(localEntry.endYear, localEntry.endMonth);

    if (!start || !end) return false;

    return start > end;
  })();

  const isFormValid =
    localEntry.title.trim() &&
    localEntry.type &&
    localEntry.startMonth &&
    localEntry.startYear &&
    (localEntry.isCurrent || (localEntry.endMonth && localEntry.endYear)) &&
    !isDateInvalid;

  return (
    <div className="flex flex-col gap-4 p-5 bg-neutral-800/40 border border-neutral-700 rounded-2xl">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-400">Tytuł / stanowisko</label>
        <input
          type="text"
          value={localEntry.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="np. Frontend Developer"
          className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-400">Rodzaj</label>
        <SelectField
          value={localEntry.type}
          onChange={(event) => updateField("type", event.target.value)}
          placeholder="Wybierz rodzaj"
        >
          {EXPERIENCE_TYPES.map((experienceType) => (
            <option key={experienceType.value} value={experienceType.value}>
              {experienceType.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-400">Opis</label>
        <textarea
          value={localEntry.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Krótki opis zakresu prac lub roli..."
          rows={3}
          className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-neutral-200 resize-none focus:outline-none focus:border-neutral-500 placeholder:text-neutral-600"
        />
      </div>

      {isDateInvalid && (
        <p className="text-xs text-red-400">
          Data rozpoczęcia nie może być późniejsza niż data zakończenia.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-400">Początek</label>
          <div className="flex gap-2">
            <SelectField
              value={localEntry.startMonth}
              onChange={(event) =>
                updateField("startMonth", Number(event.target.value))
              }
              placeholder="Miesiąc"
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              value={localEntry.startYear}
              onChange={(event) =>
                updateField("startYear", Number(event.target.value))
              }
              placeholder="Rok"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-400">Koniec</label>
          <div className="flex gap-2">
            <SelectField
              value={localEntry.endMonth}
              onChange={(event) =>
                updateField("endMonth", Number(event.target.value))
              }
              disabled={localEntry.isCurrent}
              placeholder="Miesiąc"
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              value={localEntry.endYear}
              onChange={(event) =>
                updateField("endYear", Number(event.target.value))
              }
              disabled={localEntry.isCurrent}
              placeholder="Rok"
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </SelectField>
          </div>
          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={localEntry.isCurrent}
              onChange={(event) => {
                updateField("isCurrent", event.target.checked);
                if (event.target.checked) {
                  updateField("endMonth", "");
                  updateField("endYear", "");
                }
              }}
              className="accent-yellow-400 w-4 h-4"
            />
            <span className="text-xs text-neutral-400">Obecnie</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isFormValid}
          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isFormValid
              ? "bg-brand border border-brand text-neutral-100 hover:opacity-90"
              : "bg-neutral-800 border border-neutral-700 text-neutral-600 cursor-not-allowed"
          }`}
        >
          Zapisz
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-xl text-sm border border-neutral-700 text-neutral-300 hover:border-neutral-500 transition-all"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

function ExperienceEntryCard({ entry, onEdit, onRemove }) {
  const startLabel = `${monthLabel(entry.startMonth)} ${entry.startYear}`;
  const endLabel =
    entry.isCurrent || (!entry.endMonth && !entry.endYear)
      ? "obecnie"
      : `${monthLabel(entry.endMonth)} ${entry.endYear}`;

  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-neutral-800/25 border border-neutral-800 rounded-2xl group">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-neutral-100">{entry.title}</span>
          <span className="px-2 py-0.5 rounded-full bg-brand border border-brand text-xs">
            {typeLabel(entry.type)}
          </span>
        </div>
        <span className="text-xs text-neutral-400">
          {startLabel} – {endLabel}
        </span>
        {entry.description && (
          <p className="text-sm text-neutral-300 mt-1 leading-relaxed">
            {entry.description}
          </p>
        )}
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 transition-all"
          title="Edytuj"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-red-400 hover:border-red-800 transition-all"
          title="Usuń"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200 transition-all text-sm"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      Dodaj doświadczenie
    </button>
  );
}

export function ExperienceSection({ entries, onChange }) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSaveNew = (newEntry) => {
    onChange([...entries, newEntry]);
    setIsAddingNew(false);
  };

  const handleSaveEdit = (updatedEntry) => {
    const updatedEntries = entries.map((entry, index) =>
      index === editingIndex ? updatedEntry : entry,
    );
    onChange(updatedEntries);
    setEditingIndex(null);
  };

  const handleRemove = (indexToRemove) => {
    onChange(entries.filter((_, index) => index !== indexToRemove));
  };

  const isFormOpen = isAddingNew || editingIndex !== null;

  return (
    <div className="flex flex-col gap-3">
      {entries.length === 0 && !isAddingNew && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-neutral-500">Brak</p>
          <AddButton onClick={() => setIsAddingNew(true)} />
        </div>
      )}

      {entries.length > 0 && (
        <div className="flex flex-col gap-2">
          {entries.map((entry, index) =>
            editingIndex === index ? (
              <ExperienceForm
                key={index}
                entry={entry}
                onSave={handleSaveEdit}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <ExperienceEntryCard
                key={index}
                entry={entry}
                onEdit={() => setEditingIndex(index)}
                onRemove={() => handleRemove(index)}
              />
            ),
          )}
        </div>
      )}

      {isAddingNew && (
        <ExperienceForm
          entry={{ ...emptyEntry }}
          onSave={handleSaveNew}
          onCancel={() => setIsAddingNew(false)}
        />
      )}

      {!isFormOpen && entries.length > 0 && (
        <AddButton onClick={() => setIsAddingNew(true)} />
      )}
    </div>
  );
}

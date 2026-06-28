package org.example.backend.service;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.example.backend.dto.request.contract.GenerateContractRequest;
import org.example.backend.entity.ContractType;
import org.springframework.stereotype.Service;

@Service
public class ContractPdfService {

    private static final float PAGE_MARGIN = 60f;
    private static final DateTimeFormatter TARGET_DATE_FORMATTER =
        DateTimeFormatter.ofPattern("dd.MM.yyyy");

    // Słownik do zapisu słownego liczb po polsku
    private static final String[] S_SETKI = {
        "",
        "sto ",
        "dwieście ",
        "trzysta ",
        "czterysta ",
        "pięćset ",
        "sześćset ",
        "siedemset ",
        "osiemset ",
        "dziewięćset ",
    };
    private static final String[] S_DZIESIATKI = {
        "",
        "dziesięć ",
        "dwadzieścia ",
        "trzydzieści ",
        "czterdzieści ",
        "pięćdziesiąt ",
        "sześćdziesiąt ",
        "siedemdziesiąt ",
        "osiemdziesiąt ",
        "dziewięćdziesiąt ",
    };
    private static final String[] S_NASTKI = {
        "",
        "jedenaście ",
        "dwanaście ",
        "trzynaście ",
        "czternaście ",
        "piętnaście ",
        "szesnaście ",
        "siedemnaście ",
        "osiemnaście ",
        "dziewiętnaście ",
    };
    private static final String[] S_JEDNOSCI = {
        "",
        "jeden ",
        "dwa ",
        "trzy ",
        "cztery ",
        "pięć ",
        "sześć ",
        "siedem ",
        "osiem ",
        "dziewięć ",
    };
    private static final String[][] S_GRUPY = {
        { "", "", "" },
        { "tysiąc ", "tysiące ", "tysięcy " },
        { "milion ", "miliony ", "milionów " },
        { "miliard ", "miliardy ", "miliardów " },
    };

    public byte[] generate(
        GenerateContractRequest request,
        ContractType contractType
    ) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument, PageSize.A4);
            document.setMargins(
                PAGE_MARGIN,
                PAGE_MARGIN,
                PAGE_MARGIN,
                PAGE_MARGIN
            );

            PdfFont fontRegular = PdfFontFactory.createFont(
                "Helvetica",
                PdfEncodings.CP1250,
                PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED
            );
            PdfFont fontBold = PdfFontFactory.createFont(
                "Helvetica-Bold",
                PdfEncodings.CP1250,
                PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED
            );

            boolean isDzielo =
                contractType == ContractType.UMOWA_O_DZIELO ||
                "UMOWA_O_DZIELO".equals(request.contractType());

            String title = isDzielo ? "UMOWA O DZIEŁO" : "UMOWA ZLECENIE";

            // Deklinacja ról dla zachowania poprawnej gramatyki polskiej
            String ordererInstrumental = isDzielo
                ? "Zamawiającym"
                : "Zleceniodawcą"; // Narzędnik: "zwanym dalej..."
            String specialistInstrumental = isDzielo
                ? "Wykonawcą"
                : "Zleceniobiorcą";

            String ordererNominative = isDzielo
                ? "Zamawiający"
                : "Zleceniodawca"; // Mianownik: Podpisy / Kto zleca
            String specialistNominative = isDzielo
                ? "Wykonawca"
                : "Zleceniobiorca";

            String ordererGenitive = isDzielo
                ? "Zamawiającego"
                : "Zleceniodawcy"; // Dopełniacz: "bez zgody..."
            String ordererDative = isDzielo ? "Zamawiającemu" : "Zleceniodawcy"; // Celownik: "zapłaci..."

            // Biernik: "wystawionego przez..." (Wykonawcę / Zleceniobiorcę)
            String specialistAccusative = isDzielo
                ? "Wykonawcę"
                : "Zleceniobiorcę";

            // 1. Miejsce i data zawarcia umowy (prawa strona)
            String placeAndDate = "";
            if (isNotEmpty(request.contractPlace())) placeAndDate +=
                request.contractPlace();
            if (isNotEmpty(request.contractDate())) {
                if (!placeAndDate.isEmpty()) placeAndDate += ", ";
                placeAndDate += formatDate(request.contractDate()) + " r.";
            }

            if (!placeAndDate.isEmpty()) {
                Paragraph metaParagraph = new Paragraph(placeAndDate)
                    .setFont(fontRegular)
                    .setFontSize(10f)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(12f); // Zmniejszono z 20f
                document.add(metaParagraph);
            }

            // 2. Tytuł umowy
            Paragraph titleParagraph = new Paragraph(title)
                .setFont(fontBold)
                .setFontSize(12f)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(15f); // Zmniejszono z 25f
            document.add(titleParagraph);

            // 3. Preambuła (Strony umowy)
            String ordererDetails = buildOrdererDetails(request);
            String specialistDetails = buildSpecialistDetails(request);

            Paragraph preamble = new Paragraph()
                .setFont(fontRegular)
                .setFontSize(10f)
                .setMarginBottom(12f); // Zmniejszono z 20f
            preamble.add("Zawarta pomiędzy:\n\n");
            preamble.add(new Text(ordererDetails).setFont(fontRegular));
            preamble.add(", zwanym dalej ");
            preamble.add(new Text(ordererInstrumental).setFont(fontBold));
            preamble.add("\n\na\n\n");
            preamble.add(new Text(specialistDetails).setFont(fontRegular));
            preamble.add(", zwanym dalej ");
            preamble.add(new Text(specialistInstrumental).setFont(fontBold));
            preamble.add(", o następującej treści:");
            document.add(preamble);

            int sectionCounter = 1;

            if (isDzielo) {
                // --- UMOWA O DZIEŁO ---
                if (isNotEmpty(request.subjectDescription())) {
                    addSectionHeader(
                        document,
                        "§ " + sectionCounter++,
                        fontBold
                    );
                    document.add(
                        new Paragraph(
                            ordererNominative +
                                " powierza wykonanie, a " +
                                specialistNominative +
                                " zobowiązuje się wykonać dzieło polegające na: " +
                                request.subjectDescription()
                        )
                            .setFont(fontRegular)
                            .setFontSize(10f)
                            .setMarginBottom(6f) // Zmniejszono z 10f
                    );
                }

                if (Boolean.TRUE.equals(request.provideMaterials())) {
                    addSectionHeader(
                        document,
                        "§ " + sectionCounter++,
                        fontBold
                    );
                    String matDeadline = formatDate(
                        request.materialsDeadline()
                    );
                    String matDesc = request.materialsDescription();

                    StringBuilder matSb = new StringBuilder(
                        "1. Dla wykonania dzieła " +
                            ordererNominative +
                            " zobowiązuje się wydać " +
                            specialistDative(specialistNominative)
                    );
                    if (isNotEmpty(matDeadline)) matSb
                        .append(" w terminie do dnia ")
                        .append(matDeadline);
                    if (isNotEmpty(matDesc)) matSb
                        .append(" następujące materiały i narzędzia: ")
                        .append(matDesc);
                    else matSb.append(" niezbędne materiały i narzędzia");
                    matSb
                        .append(".\n2. ")
                        .append(specialistNominative)
                        .append(
                            " zobowiązany jest przedstawić rozliczenie z otrzymanych materiałów i narzędzi, a niezużyte zwrócić "
                        )
                        .append(ordererDative)
                        .append(" w dniu wydania dzieła.");

                    document.add(
                        new Paragraph(matSb.toString())
                            .setFont(fontRegular)
                            .setFontSize(10f)
                            .setMarginBottom(6f) // Zmniejszono z 10f
                    );
                }
            } else {
                // --- UMOWA ZLECENIA ---
                if (isNotEmpty(request.subjectDescription())) {
                    addSectionHeader(
                        document,
                        "§ " + sectionCounter++,
                        fontBold
                    );
                    document.add(
                        new Paragraph(
                            "Na podstawie niniejszej umowy " +
                                ordererNominative +
                                " zleca, a " +
                                specialistNominative +
                                " zobowiązuje się do wykonania następujących czynności: " +
                                request.subjectDescription()
                        )
                            .setFont(fontRegular)
                            .setFontSize(10f)
                            .setMarginBottom(6f) // Zmniejszono z 10f
                    );
                }
            }

            // § Czas trwania / Terminy (Wspólne, dynamicznie dopasowane)
            String startDt = isNotEmpty(request.startDate())
                ? formatDate(request.startDate())
                : null;
            String endDt = isNotEmpty(request.completionDeadline())
                ? formatDate(request.completionDeadline())
                : null;

            if (startDt != null || endDt != null) {
                addSectionHeader(document, "§ " + sectionCounter++, fontBold);
                StringBuilder dateSb = new StringBuilder();
                if (isDzielo) {
                    if (startDt != null && endDt != null) {
                        dateSb
                            .append(
                                "Termin rozpoczęcia dzieła strony ustaliły na dzień "
                            )
                            .append(startDt)
                            .append(", a wykonania na dzień ")
                            .append(endDt)
                            .append(".");
                    } else if (startDt != null) {
                        dateSb
                            .append(
                                "Termin rozpoczęcia dzieła strony ustaliły na dzień "
                            )
                            .append(startDt)
                            .append(".");
                    } else {
                        dateSb
                            .append(
                                "Termin wykonania dzieła strony ustaliły na dzień "
                            )
                            .append(endDt)
                            .append(".");
                    }
                } else {
                    if (startDt != null && endDt != null) {
                        dateSb
                            .append("Umowa została zawarta na czas od ")
                            .append(startDt)
                            .append(" do ")
                            .append(endDt)
                            .append(".");
                    } else if (startDt != null) {
                        dateSb
                            .append("Umowa została zawarta od dnia ")
                            .append(startDt)
                            .append(" na czas nieokreślony.");
                    } else {
                        dateSb
                            .append("Umowa została zawarta do dnia ")
                            .append(endDt)
                            .append(".");
                    }
                }
                document.add(
                    new Paragraph(dateSb.toString())
                        .setFont(fontRegular)
                        .setFontSize(10f)
                        .setMarginBottom(6f) // Zmniejszono z 10f
                );
            }

            // § Podwykonawstwo / Osobiste wykonanie
            if (isDzielo) {
                addSectionHeader(document, "§ " + sectionCounter++, fontBold);
                if (Boolean.TRUE.equals(request.canDelegate())) {
                    document.add(
                        new Paragraph(
                            specialistNominative +
                                " ma prawo powierzyć wykonanie dzieła innej osobie, jednakże jest on odpowiedzialny wobec " +
                                ordererGenitive +
                                " za jej działania, jak za własne."
                        )
                            .setFont(fontRegular)
                            .setFontSize(10f)
                            .setMarginBottom(6f) // Zmniejszono z 10f
                    );
                } else {
                    document.add(
                        new Paragraph(
                            specialistNominative +
                                " nie może powierzyć prac związanych z wykonaniem dzieła innym osobom bez uprzedniej zgody " +
                                ordererGenitive +
                                "."
                        )
                            .setFont(fontRegular)
                            .setFontSize(10f)
                            .setMarginBottom(6f) // Zmniejszono z 10f
                    );
                }
            } else {
                addSectionHeader(document, "§ " + sectionCounter++, fontBold);
                document.add(
                    new Paragraph(
                        specialistNominative +
                            " nie może powierzyć prac wymienionych w § 1 innym osobom bez zgody " +
                            ordererGenitive +
                            "."
                    )
                        .setFont(fontRegular)
                        .setFontSize(10f)
                        .setMarginBottom(6f) // Zmniejszono z 10f
                );
            }

            // § Wynagrodzenie (Automatyczny słowny zapis kwoty)
            addSectionHeader(document, "§ " + sectionCounter++, fontBold);
            String amount =
                request.remunerationAmount() != null
                    ? String.valueOf(request.remunerationAmount())
                    : "";
            String currency = isNotEmpty(request.remunerationCurrency())
                ? request.remunerationCurrency()
                : "zł";

            // Jeśli brak słownego zapisu w requeście, generujemy go automatycznie z kwoty liczbowej
            String amountWords = isNotEmpty(request.remunerationAmountWords())
                ? request.remunerationAmountWords()
                : (!amount.isEmpty() ? moneyToWords(amount) : "");

            StringBuilder remSb = new StringBuilder();
            if (isDzielo) {
                remSb
                    .append("1. ")
                    .append(specialistDative(specialistNominative))
                    .append(" przysługuje wynagrodzenie za wykonanie dzieła");
            } else {
                remSb
                    .append("1. Za wykonanie prac określonych w § 1 ")
                    .append(specialistNominative)
                    .append(" otrzyma po ich wykonaniu wynagrodzenie");
            }

            if (!amount.isEmpty()) {
                remSb
                    .append(" w wysokości ")
                    .append(amount)
                    .append(" ")
                    .append(currency);
                if (!amountWords.isEmpty()) {
                    String currencySuffix = (currency.equalsIgnoreCase("PLN") ||
                        currency.equalsIgnoreCase("zł"))
                        ? "złotych"
                        : currency;
                    remSb
                        .append(" (słownie: ")
                        .append(amountWords)
                        .append(" ")
                        .append(currencySuffix)
                        .append(")");
                }
                if (!isDzielo) remSb.append(" brutto");
                remSb.append(".\n");
            } else {
                remSb.append(" w ustalonej przez strony wysokości.\n");
            }

            String pMethod = isNotEmpty(request.paymentMethod())
                ? request.paymentMethod().toLowerCase()
                : "przelewu";
            String pDeadline = isNotEmpty(request.paymentDeadline())
                ? request.paymentDeadline()
                : null;

            remSb
                .append("2. Wynagrodzenie płatne jest w formie ")
                .append(pMethod);
            if (isDzielo) {
                remSb.append(
                    pDeadline != null
                        ? " " + pDeadline
                        : " w dniu odbioru wykonanego dzieła"
                );
                remSb
                    .append(", na podstawie wystawionego przez ")
                    .append(specialistAccusative) // POPRAWIONO: Zmiana ze specialistInstrumental ("Wykonawcą") na specialistAccusative ("Wykonawcę")
                    .append(" rachunku.");
            } else {
                remSb
                    .append(", na podstawie rachunku przedstawionego przez ") // Dodano przecinek dla lepszej stylistyki
                    .append(specialistInstrumental);
                remSb.append(
                    pDeadline != null
                        ? " w terminie: " + pDeadline
                        : " po przedstawieniu rachunku"
                );
                remSb.append(".");
            }
            document.add(
                new Paragraph(remSb.toString())
                    .setFont(fontRegular)
                    .setFontSize(10f)
                    .setMarginBottom(6f) // Zmniejszono z 10f
            );

            // § Kary umowne (Tylko dla dzieła, o ile zaznaczone i kwota nie jest pusta)
            if (
                isDzielo &&
                Boolean.TRUE.equals(request.hasPenalties()) &&
                isNotEmpty(request.penaltyAmount())
            ) {
                addSectionHeader(document, "§ " + sectionCounter++, fontBold);
                document.add(
                    new Paragraph(
                        "1. W przypadku jakichkolwiek opóźnień w wykonaniu dzieła " +
                            specialistNominative +
                            " zapłaci " +
                            ordererDative +
                            " karę umowną w wysokości " +
                            request.penaltyAmount() +
                            " " +
                            currency +
                            ".\n" +
                            "2. W razie zwłoki w wykonaniu dzieła " +
                            ordererNominative +
                            " może odstąpić od umowy bez konieczności wyznaczania dodatkowego terminu."
                    )
                        .setFont(fontRegular)
                        .setFontSize(10f)
                        .setMarginBottom(6f) // Zmniejszono z 10f
                );
            }

            // § Zmiany umowy (Tylko dla Umowy o dzieło z pierwotnego kodu)
            if (isDzielo) {
                addSectionHeader(document, "§ " + sectionCounter++, fontBold);
                document.add(
                    new Paragraph(
                        "Zmiany umowy wymagają formy pisemnej pod rygorem nieważności."
                    )
                        .setFont(fontRegular)
                        .setFontSize(10f)
                        .setMarginBottom(6f) // Zmniejszono z 10f
                );
            }

            // § Kodeks Cywilny
            addSectionHeader(document, "§ " + sectionCounter++, fontBold);
            document.add(
                new Paragraph(
                    "W sprawach nieuregulowanych niniejszą umową mają zastosowanie przepisy Kodeksu Cywilnego."
                )
                    .setFont(fontRegular)
                    .setFontSize(10f)
                    .setMarginBottom(6f) // Zmniejszono z 10f
            );

            // § Egzemplarze
            addSectionHeader(document, "§ " + sectionCounter++, fontBold);
            Integer copies =
                request.numberOfCopies() != null ? request.numberOfCopies() : 2;
            document.add(
                new Paragraph(
                    "Umowa została sporządzona w " +
                        copies +
                        " jednobrzmiących egzemplarzach - po jednym dla każdej ze stron."
                )
                    .setFont(fontRegular)
                    .setFontSize(10f)
                    .setMarginBottom(20f) // Zmniejszono z 30f
            );

            // 5. Sekcja podpisów
            document.add(new Paragraph("\n")); // Zmniejszono z \n\n
            Table signaturesTable = new Table(
                UnitValue.createPercentArray(new float[] { 50f, 50f })
            );
            signaturesTable.setWidth(UnitValue.createPercentValue(100));

            Cell ordererCell = new Cell()
                .add(
                    new Paragraph(
                        "......................................................\n(" +
                            ordererNominative +
                            ")"
                    )
                        .setFont(fontRegular)
                        .setFontSize(10f)
                        .setTextAlignment(TextAlignment.CENTER)
                )
                .setBorder(Border.NO_BORDER);
            Cell specialistCell = new Cell()
                .add(
                    new Paragraph(
                        "......................................................\n(" +
                            specialistNominative +
                            ")"
                    )
                        .setFont(fontRegular)
                        .setFontSize(10f)
                        .setTextAlignment(TextAlignment.CENTER)
                )
                .setBorder(Border.NO_BORDER);

            signaturesTable.addCell(ordererCell);
            signaturesTable.addCell(specialistCell);
            document.add(signaturesTable);

            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(
                "Błąd podczas generowania pliku PDF umowy: " + e.getMessage(),
                e
            );
        }
    }

    private String buildOrdererDetails(GenerateContractRequest request) {
        if ("COMPANY".equals(request.ordererType())) {
            StringBuilder sb = new StringBuilder(request.ordererCompanyName());
            String address = buildAddress(
                request.ordererPostalCode(),
                request.ordererCity(),
                request.ordererAddress(),
                true
            );
            if (!address.isEmpty()) sb.append(", z siedzibą w: ").append(
                address
            );
            if (isNotEmpty(request.ordererNip())) sb.append(", NIP: ").append(
                request.ordererNip()
            );
            if (isNotEmpty(request.ordererKrs())) sb.append(", KRS: ").append(
                request.ordererKrs()
            );
            if (isNotEmpty(request.ordererRegon())) sb.append(
                ", REGON: "
            ).append(request.ordererRegon());
            if (isNotEmpty(request.ordererRepresentativeName())) {
                sb.append(", reprezentowaną przez: ").append(
                    request.ordererRepresentativeName()
                );
                if (isNotEmpty(request.ordererRepresentativeTitle())) {
                    sb.append(" (")
                        .append(request.ordererRepresentativeTitle())
                        .append(")");
                }
            }
            return sb.toString();
        } else {
            StringBuilder sb = new StringBuilder(request.ordererFullName());
            String address = buildAddress(
                request.ordererPostalCode(),
                request.ordererCity(),
                request.ordererAddress(),
                false
            );
            if (!address.isEmpty()) sb.append(
                ", zamieszkałym(ą) pod adresem: "
            ).append(address);
            if (isNotEmpty(request.ordererPesel())) sb.append(
                ", PESEL: "
            ).append(request.ordererPesel());
            if (isNotEmpty(request.ordererIdNumber())) sb.append(
                ", legitymującym(ą) się dowodem osobistym o serii i nr: "
            ).append(request.ordererIdNumber());
            return sb.toString();
        }
    }

    private String buildSpecialistDetails(GenerateContractRequest request) {
        StringBuilder sb = new StringBuilder(request.specialistFullName());
        String address = buildAddress(
            request.specialistPostalCode(),
            request.specialistCity(),
            request.specialistAddress(),
            false
        );
        if (!address.isEmpty()) sb.append(
            ", zamieszkałym(ą) pod adresem: "
        ).append(address);
        if (isNotEmpty(request.specialistPesel())) sb.append(
            ", PESEL: "
        ).append(request.specialistPesel());
        if (isNotEmpty(request.specialistIdNumber())) sb.append(
            ", legitymującym(ą) się dowodem osobistym o serii i nr: "
        ).append(request.specialistIdNumber());

        if (
            isNotEmpty(request.specialistEmail()) ||
            isNotEmpty(request.specialistPhone())
        ) {
            sb.append(" (kontakt - ");
            if (isNotEmpty(request.specialistEmail())) sb.append(
                "email: "
            ).append(request.specialistEmail());
            if (isNotEmpty(request.specialistPhone())) {
                if (isNotEmpty(request.specialistEmail())) sb.append(", ");
                sb.append("tel: ").append(request.specialistPhone());
            }
            sb.append(")");
        }
        return sb.toString();
    }

    private String buildAddress(
        String postalCode,
        String city,
        String street,
        boolean isCompany
    ) {
        StringBuilder sb = new StringBuilder();
        if (isNotEmpty(postalCode)) sb.append(postalCode).append(" ");
        if (isNotEmpty(city)) sb.append(city);
        if (isNotEmpty(street)) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(isCompany ? "przy ul. " : "ul. ").append(street);
        }
        return sb.toString();
    }

    private String specialistDative(String nominative) {
        return nominative.equalsIgnoreCase("Wykonawca")
            ? "Wykonawcy"
            : "Zleceniobiorcy";
    }

    private void addSectionHeader(
        Document document,
        String sectionText,
        PdfFont font
    ) {
        document.add(
            new Paragraph(sectionText)
                .setFont(font)
                .setFontSize(12f)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(4f) // Zmniejszono z 8f
                .setMarginBottom(2f) // Zmniejszono z 4f
        );
    }

    private String formatDate(String dateStr) {
        if (!isNotEmpty(dateStr)) return "";
        try {
            LocalDate date = LocalDate.parse(dateStr);
            return date.format(TARGET_DATE_FORMATTER);
        } catch (Exception e) {
            return dateStr;
        }
    }

    private boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    // --- METODY DO KONWERSJI LICZBY NA SŁOWA ---
    private String moneyToWords(String amountStr) {
        if (amountStr == null || amountStr.trim().isEmpty()) return "";
        try {
            amountStr = amountStr.trim().replace(",", ".");
            BigDecimal bd = new BigDecimal(amountStr);
            long zlote = bd.longValue();
            int grosze = bd
                .subtract(BigDecimal.valueOf(zlote))
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();

            String zloteWords = numberToWords(zlote);
            if (grosze > 0) {
                return zloteWords + " i " + grosze + "/100";
            }
            return zloteWords;
        } catch (Exception e) {
            return amountStr; // W razie błędu parsowania zwraca oryginalny string
        }
    }

    private String numberToWords(long numer) {
        if (numer == 0) return "zero";
        StringBuilder sb = new StringBuilder();
        int g = 0;
        while (numer > 0) {
            long doStup = numer % 1000;
            long s = doStup / 100;
            long d = (doStup % 100) / 10;
            long j = doStup % 10;

            StringBuilder part = new StringBuilder();
            if (s > 0) part.append(S_SETKI[(int) s]);

            if (d == 1 && j > 0) {
                part.append(S_NASTKI[(int) j]);
            } else {
                if (d > 0) part.append(S_DZIESIATKI[(int) d]);
                if (j > 0) part.append(S_JEDNOSCI[(int) j]);
            }

            if (part.length() > 0) {
                if (g > 0) {
                    if (doStup == 1) {
                        part.append(S_GRUPY[g][0]);
                    } else if ((j == 2 || j == 3 || j == 4) && d != 1) {
                        part.append(S_GRUPY[g][1]);
                    } else {
                        part.append(S_GRUPY[g][2]);
                    }
                }
                sb.insert(0, part);
            }
            numer /= 1000;
            g++;
        }
        return sb.toString().trim();
    }
}

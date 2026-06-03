export function validateForm(formData) {
  if (!formData.specialization.trim()) {
    return {
      success: false,
      message: "Specjalizacja jest wymagana.",
    };
  }

  if (!formData.description.trim()) {
    return {
      success: false,
      message: "Opis jest wymagany.",
    };
  }

  if (!formData.experience.trim()) {
    return {
      success: false,
      message: "Doświadczenie jest wymagane.",
    };
  }

  if (!formData.localization.trim()) {
    return {
      success: false,
      message: "Lokalizacja jest wymagana.",
    };
  }

  if (!formData.phoneNumber.trim()) {
    return {
      success: false,
      message: "Numer telefonu jest wymagany.",
    };
  }

  if (!formData.email.trim()) {
    return {
      success: false,
      message: "Adres e-mail jest wymagany.",
    };
  }

  const phoneRegex = /^(\+48)?[\s-]?(\d{3}[\s-]?\d{3}[\s-]?\d{3})$/;

  if (!phoneRegex.test(formData.phoneNumber)) {
    return {
      success: false,
      message: "Numer telefonu ma nieprawidłowy format.",
    };
  }

  const hasEnabledPrice = Object.values(formData.prices).some(
    (price) => price.enabled,
  );

  if (!hasEnabledPrice) {
    return {
      success: false,
      message: "Musisz wybrać przynajmniej jeden rodzaj wyceny.",
    };
  }

  if (formData.images.length < 1 || formData.images.length > 8) {
    return {
      success: false,
      message: "Liczba zdjęć musi być między 1 a 8.",
    };
  }

  if (!formData.availability.length) {
    return {
      success: false,
      message: "Musisz wybrać przynajmniej jeden dzień.",
    };
  }

  for (const item of formData.availability) {
    if (item.startTime >= item.endTime) {
      return {
        success: false,
        message:
          "Godzina rozpoczęcia musi być wcześniejsza niż godzina zakończenia.",
      };
    }
  }

  if (formData.categories.length < 1 || formData.categories.length > 5) {
    return {
      success: false,
      message: "Liczba kategorii musi być między 1 a 5.",
    };
  }

  return {
    success: true,
  };
}

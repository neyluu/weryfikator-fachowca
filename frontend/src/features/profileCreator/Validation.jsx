import { LIMITS } from "./Constants.jsx";

export function validateForm(formData) {
  const specialization = formData.specialization.trim();
  if (!specialization) {
    return {
      success: false,
      message: "Specjalizacja jest wymagana.",
    };
  }
  if (
    specialization.length < LIMITS.specialization.min ||
    specialization.length > LIMITS.specialization.max
  ) {
    return {
      success: false,
      message:
        "Specjalizacja musi zmieścić się w limicie znaków (" +
        LIMITS.specialization.min +
        "/" +
        LIMITS.specialization.max +
        ")",
    };
  }

  const description = formData.description.trim();
  if (!description) {
    return {
      success: false,
      message: "Opis jest wymagany.",
    };
  }
  if (
    description.length < LIMITS.description.min ||
    description.length > LIMITS.description.max
  ) {
    return {
      success: false,
      message:
        "Opis musi zmieścić się w limicie znaków (" +
        LIMITS.description.min +
        "/" +
        LIMITS.description.max +
        ")",
    };
  }

  if (!formData.localization) {
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

  const prices = formData.prices;
  if (
    (prices.consultation.enabled &&
      prices.consultation.value.min > prices.consultation.value.max) ||
    (prices.hourly.enabled &&
      prices.hourly.value.min > prices.hourly.value.max) ||
    (prices.project.enabled &&
      prices.project.value.min > prices.project.value.max)
  ) {
    return {
      success: false,
      message: "Minimalna stawka nie może być większa od maksymalnej.",
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

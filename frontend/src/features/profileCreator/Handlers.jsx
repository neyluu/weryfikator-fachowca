import { useState } from "react";
import { convertToBase64 } from "./Utils.jsx";

export function useProfileForm() {
  const [savedHours, setSavedHours] = useState({});
  const [formData, setFormData] = useState({
    specialization: "",
    description: "",
    localization: null,
    phoneNumber: "",
    email: "",
    profilePicture: "",
    prices: {
      consultation: {
        enabled: false,
        value: { min: 0, max: 0 },
      },
      hourly: {
        enabled: false,
        value: { min: 0, max: 0 },
      },
      project: {
        enabled: false,
        value: { min: 0, max: 0 },
      },
    },
    images: [],
    availability: [],
    categories: [],
    paidTravel: false,
    remoteConsultations: false,
    experienceEntries: [],
  });

  const toggleDay = (day) => {
    setFormData((previous) => {
      const existing = previous.availability.find((item) => item.day === day);

      if (existing) {
        setSavedHours((previousHours) => ({
          ...previousHours,
          [day]: {
            startTime: existing.startTime,
            endTime: existing.endTime,
          },
        }));

        return {
          ...previous,
          availability: previous.availability.filter(
            (item) => item.day !== day,
          ),
        };
      }

      return {
        ...previous,
        availability: [
          ...previous.availability,
          {
            day,
            startTime: savedHours[day]?.startTime ?? "00:00",
            endTime: savedHours[day]?.endTime ?? "23:59",
          },
        ],
      };
    });
  };

  const updateHour = (day, value, type) => {
    setFormData((previous) => ({
      ...previous,
      availability: previous.availability.map((item) =>
        item.day === day
          ? {
              ...item,
              [type]: value,
            }
          : item,
      ),
    }));
  };

  const toggleCategory = (category) => {
    setFormData((previous) => ({
      ...previous,
      categories: previous.categories.includes(category)
        ? previous.categories.filter(
            (existingCategory) => existingCategory !== category,
          )
        : [...previous.categories, category],
    }));
  };

  const togglePrice = (key) => {
    setFormData((previous) => ({
      ...previous,
      prices: {
        ...previous.prices,
        [key]: {
          ...previous.prices[key],
          enabled: !previous.prices[key].enabled,
        },
      },
    }));
  };

  const handleAddPhotos = (event) => {
    const chosenFiles = Array.from(event.target.files);

    const newPhotos = chosenFiles.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      url: URL.createObjectURL(file),
    }));

    setFormData((previous) => ({
      ...previous,
      images: [...previous.images, ...newPhotos],
    }));
  };

  const handleAddProfilePicture = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertToBase64(file);

    const photo = {
      id: crypto.randomUUID(),
      file: file,
      url: base64,
    };

    setFormData((previous) => ({
      ...previous,
      profilePicture: photo,
    }));
  };

  const removePhoto = (idToRemove) => {
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter((photo) => photo.id !== idToRemove),
    }));
  };

  const removeProfilePicture = () => {
    setFormData((previous) => ({
      ...previous,
      profilePicture: "",
    }));
  };

  const updatePrice = (key, field, value) => {
    const numericValue = Number(value);

    setFormData((previous) => {
      const current = previous.prices[key];

      let min = current.value.min;
      let max = current.value.max;

      if (field === "min") min = numericValue;
      if (field === "max") max = numericValue;

      return {
        ...previous,
        prices: {
          ...previous.prices,
          [key]: {
            ...current,
            value: { min, max },
          },
        },
      };
    });
  };

  const updateExperienceEntries = (updatedEntries) => {
    setFormData((previous) => ({
      ...previous,
      experienceEntries: updatedEntries,
    }));
  };

  return {
    formData,
    setFormData,
    toggleDay,
    updateHour,
    toggleCategory,
    togglePrice,
    handleAddPhotos,
    handleAddProfilePicture,
    removePhoto,
    removeProfilePicture,
    updatePrice,
    updateExperienceEntries,
  };
}

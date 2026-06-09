import { useState } from "react";
import { convertToBase64 } from "./Utils.jsx";

export function useProfileForm() {
  const [savedHours, setSavedHours] = useState({});
  const [formData, setFormData] = useState({
    specialization: "",
    description: "",
    experience: "",
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
    availability: [
      /*
            {
              day: "Pon",
              startTime: "00:00",
              endTime: "09:00"
            },
          */
    ],
    categories: [],
    paidTravel: false,
    remoteConsultations: false
  });

  const toggleDay = (day) => {
    setFormData((prev) => {
      const existing = prev.availability.find((item) => item.day === day);

      if (existing) {
        setSavedHours((prevHours) => ({
          ...prevHours,
          [day]: {
            startTime: existing.startTime,
            endTime: existing.endTime,
          },
        }));

        return {
          ...prev,
          availability: prev.availability.filter((item) => item.day !== day),
        };
      }

      return {
        ...prev,
        availability: [
          ...prev.availability,
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
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((item) =>
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
    setFormData((prev) => {
      return {
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const togglePrice = (key) => {
    setFormData((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [key]: {
          ...prev.prices[key],
          enabled: !prev.prices[key].enabled,
        },
      },
    }));
  };

  const handleAddPhotos = (e) => {
    const chosenFiles = Array.from(e.target.files);

    const newPhotos = chosenFiles.map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newPhotos],
    }));
  };

  const handleAddProfilePicture = async (e) => {
    const file = e.target.files[0];

    const base64 = await convertToBase64(file);

    const photo = {
      id: crypto.randomUUID(),
      file: file,
      url: base64,
    };

    setFormData((prev) => ({
      ...prev,
      profilePicture: photo,
    }));
  };

  const removePhoto = (idToRemove) => {
    setFormData((prev) => {
      return {
        ...prev,
        images: prev.images.filter((photo) => photo.id !== idToRemove),
      };
    });
  };

  const removeProfilePicture = () => {
    setFormData((prev) => {
      return {
        ...prev,
        profilePicture: "",
      };
    });
  };

  const updatePrice = (key, field, value) => {
    const num = Number(value);

    setFormData((prev) => {
      const current = prev.prices[key];

      let min = current.value.min;
      let max = current.value.max;

      if (field === "min") min = num;
      if (field === "max") max = num;

      return {
        ...prev,
        prices: {
          ...prev.prices,
          [key]: {
            ...current,
            value: {
              min,
              max,
            },
          },
        },
      };
    });
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
  };
}

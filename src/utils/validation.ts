import type {
  Participant,
  ParticipantDraft,
  ParticipantErrors,
} from "@/types/participant";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+380\d{9}$/;

export function validateParticipant(
  participant: ParticipantDraft,
  participants: Participant[],
  currentParticipantId?: string,
): ParticipantErrors {
  const errors: ParticipantErrors = {};

  if (!participant.name.trim()) {
    errors.name = "Введіть ім’я учасника";
  }

  if (!participant.birthDate) {
    errors.birthDate = "Вкажіть дату народження";
  } else {
    const selectedDate = new Date(`${participant.birthDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime())) {
      errors.birthDate = "Введіть правильну дату";
    } else if (selectedDate > today) {
      errors.birthDate = "Дата народження не може бути у майбутньому";
    }
  }

  const normalizedEmail = participant.email.trim().toLowerCase();

  if (!normalizedEmail) {
    errors.email = "Введіть електронну пошту";
  } else if (!emailPattern.test(normalizedEmail)) {
    errors.email = "Введіть правильну електронну пошту";
  } else {
    const emailExists = participants.some(
      (item) =>
        item.id !== currentParticipantId &&
        item.email.trim().toLowerCase() === normalizedEmail,
    );

    if (emailExists) {
      errors.email = "Учасник із такою електронною поштою вже існує";
    }
  }

  const normalizedPhone = participant.phone.trim();

  if (!normalizedPhone) {
    errors.phone = "Введіть номер телефону";
  } else if (!phonePattern.test(normalizedPhone)) {
    errors.phone = "Формат телефону: +380XXXXXXXXX";
  }

  return errors;
}

export function hasValidationErrors(errors: ParticipantErrors): boolean {
  return Object.keys(errors).length > 0;
}

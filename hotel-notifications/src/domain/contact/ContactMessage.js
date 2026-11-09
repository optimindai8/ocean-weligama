import { ValidationError } from '../shared/errors.js';
import { clean, cleanMultiline, isEmail, isPhone } from '../shared/validators.js';

const LIMITS = Object.freeze({ name: 80, subject: 120, messageMin: 10, messageMax: 2000 });
const DEFAULT_SUBJECT = 'General enquiry';

export class ContactMessage {
  constructor({ name, email, phone, subject, message }) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.subject = subject;
    this.message = message;
    Object.freeze(this);
  }

  /** Validates raw form input and returns an immutable ContactMessage. */
  static create(input) {
    const data = {
      name: clean(input.name),
      email: clean(input.email).toLowerCase(),
      phone: clean(input.phone),
      subject: clean(input.subject) || DEFAULT_SUBJECT,
      message: cleanMultiline(input.message),
    };

    const errors = {};
    if (data.name.length < 2) errors.name = 'Please enter your full name.';
    else if (data.name.length > LIMITS.name) errors.name = `Name must be ${LIMITS.name} characters or fewer.`;

    if (!isEmail(data.email)) errors.email = 'Please enter a valid email address.';
    if (!isPhone(data.phone)) errors.phone = 'Please enter a valid phone number.';

    if (data.subject.length > LIMITS.subject) {
      errors.subject = `Subject must be ${LIMITS.subject} characters or fewer.`;
    }

    if (data.message.length < LIMITS.messageMin) {
      errors.message = `Please write a message of at least ${LIMITS.messageMin} characters.`;
    } else if (data.message.length > LIMITS.messageMax) {
      errors.message = `Message must be ${LIMITS.messageMax} characters or fewer.`;
    }

    if (Object.keys(errors).length > 0) throw new ValidationError(errors);
    return new ContactMessage(data);
  }
}

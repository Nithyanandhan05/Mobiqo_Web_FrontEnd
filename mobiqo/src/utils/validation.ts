// --- EXACT REGEX FROM ANDROID ---
export const NAME_REGEX = /^[A-Za-z ]+$/;
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@(gmail\.com|email\.com|saveetha\.com)$/;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

export const validateName = (name: string): string | null => {
    if (name.length === 0) return null;
    return NAME_REGEX.test(name) ? null : "Only alphabets and spaces allowed";
};

export const validateEmail = (email: string): string | null => {
    if (email.length === 0) return null;
    return EMAIL_REGEX.test(email) ? null : "Must be @gmail.com, @email.com, or @saveetha.com";
};

export const validatePhone = (phone: string): string | null => {
    if (phone.length === 0) return null;
    return PHONE_REGEX.test(phone) ? null : "Must be exactly 10 digits";
};

export const validatePassword = (password: string): string | null => {
    if (password.length === 0) return null;
    return PASSWORD_REGEX.test(password) ? null : "8-16 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char";
};

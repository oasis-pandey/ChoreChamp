// Password validation utility functions

/**
 * Validates if a password meets strong password requirements
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid boolean and errors array
 */
export const validatePassword = (password) => {
    const errors = [];

    // Check minimum length
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    // Check for number
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    // Check for special character
    if (!/[@$!%*?&]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

/**
 * Gets password strength score (0-5)
 * @param {string} password - The password to score
 * @returns {object} - Score and feedback
 */
export const getPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
        score++;
    } else {
        feedback.push('Use at least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        feedback.push('Add uppercase letters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score++;
    } else {
        feedback.push('Add lowercase letters');
    }

    // Number check
    if (/\d/.test(password)) {
        score++;
    } else {
        feedback.push('Add numbers');
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
        score++;
    } else {
        feedback.push('Add special characters (@$!%*?&)');
    }

    // Bonus for length
    if (password.length >= 12) {
        score++;
    }

    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

    return {
        score: Math.min(score, 5),
        strength: strengthLevels[Math.min(score, 5)],
        feedback: feedback
    };
};

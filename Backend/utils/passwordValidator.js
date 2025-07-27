// Password validation utility functions

/**
 * Validates if a password meets basic requirements (no restrictions)
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid boolean and errors array
 */
export const validatePassword = (password) => {
    const errors = [];

    // Only check if password exists and has at least 1 character
    if (!password || password.length < 1) {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

/**
 * Gets password strength score (always returns 'Good' now)
 * @param {string} password - The password to score
 * @returns {object} - Score and feedback
 */
export const getPasswordStrength = (password) => {
    // Always return good strength for any non-empty password
    if (!password || password.length === 0) {
        return {
            score: 0,
            strength: 'Enter a password',
            feedback: ['Password is required']
        };
    }

    return {
        score: 1,
        strength: 'Good',
        feedback: []
    };
};

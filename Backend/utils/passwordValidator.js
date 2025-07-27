// Password validation utility functions

/**
 * Validates if a password meets basic password requirements (less strict)
 * @param {string} password - The password to validate
 * @returns {object} - Validation result with isValid boolean and errors array
 */
export const validatePassword = (password) => {
    const errors = [];

    // Check minimum length (reduced from 8 to 6)
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    // Check for at least one letter OR one number (much more relaxed)
    if (!/[a-zA-Z]/.test(password) && !/\d/.test(password)) {
        errors.push('Password must contain at least one letter or number');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

/**
 * Gets password strength score (0-3) - simplified scoring
 * @param {string} password - The password to score
 * @returns {object} - Score and feedback
 */
export const getPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    // Length check (reduced requirement)
    if (password.length >= 6) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Use at least 6 characters');
    }

    // Has letters
    if (/[a-zA-Z]/.test(password)) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Add some letters');
    }

    // Has numbers  
    if (/\d/.test(password)) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Add some numbers');
    }

    const strengthLevels = ['Weak', 'Fair', 'Good', 'Strong'];

    return {
        score: Math.min(score, 3),
        strength: strengthLevels[Math.min(score, 3)] || 'Weak',
        feedback: feedback
    };
};

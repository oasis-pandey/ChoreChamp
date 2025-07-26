import React from 'react';

/**
 * Password validation utility functions for frontend
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
 */
export const getPasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Use at least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Add uppercase letters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Add lowercase letters');
    }

    // Number check
    if (/\d/.test(password)) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Add numbers');
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
        score++;
    } else if (password.length > 0) {
        feedback.push('Add special characters (@$!%*?&)');
    }

    // Bonus for length
    if (password.length >= 12) {
        score++;
    }

    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['text-red-600', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500', 'text-green-600'];

    return {
        score: Math.min(score, 5),
        strength: strengthLevels[Math.min(score, 5)],
        color: strengthColors[Math.min(score, 5)],
        feedback: feedback
    };
};

/**
 * Password Strength Indicator Component
 */
const PasswordStrengthIndicator = ({ password }) => {
    if (!password) return null;

    const { score, strength, color, feedback } = getPasswordStrength(password);
    const { isValid, errors } = validatePassword(password);

    return (
        <div className="mt-2">
            {/* Strength Meter */}
            <div className="flex items-center mb-2">
                <span className="text-sm text-gray-600 mr-2">Strength:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${score <= 1 ? 'bg-red-500' :
                                score <= 2 ? 'bg-yellow-500' :
                                    score <= 3 ? 'bg-blue-500' :
                                        score <= 4 ? 'bg-green-500' :
                                            'bg-green-600'
                            }`}
                        style={{ width: `${(score / 5) * 100}%` }}
                    ></div>
                </div>
                <span className={`text-sm font-medium ${color}`}>{strength}</span>
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-1">
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${password.length >= 8 ? 'text-green-500' : 'text-red-500'}`}>
                        {password.length >= 8 ? '✓' : '✗'}
                    </span>
                    <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
                        At least 8 characters
                    </span>
                </div>
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>
                        {/[A-Z]/.test(password) ? '✓' : '✗'}
                    </span>
                    <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                        One uppercase letter
                    </span>
                </div>
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${/[a-z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>
                        {/[a-z]/.test(password) ? '✓' : '✗'}
                    </span>
                    <span className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                        One lowercase letter
                    </span>
                </div>
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${/\d/.test(password) ? 'text-green-500' : 'text-red-500'}`}>
                        {/\d/.test(password) ? '✓' : '✗'}
                    </span>
                    <span className={/\d/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                        One number
                    </span>
                </div>
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${/[@$!%*?&]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>
                        {/[@$!%*?&]/.test(password) ? '✓' : '✗'}
                    </span>
                    <span className={/[@$!%*?&]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                        One special character (@$!%*?&)
                    </span>
                </div>
            </div>

            {/* Validation errors */}
            {!isValid && password.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                    <div className="text-red-700 font-medium">Password requirements:</div>
                    <ul className="list-disc list-inside text-red-600 mt-1">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthIndicator;

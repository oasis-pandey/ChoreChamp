import React from 'react';

/**
 * Password validation utility functions for frontend (relaxed requirements)
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
    const strengthColors = ['text-red-600', 'text-yellow-500', 'text-blue-500', 'text-green-600'];

    return {
        score: Math.min(score, 3),
        strength: strengthLevels[Math.min(score, 3)] || 'Weak',
        color: strengthColors[Math.min(score, 3)] || 'text-red-600',
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
                        style={{ width: `${(score / 3) * 100}%` }}
                    ></div>
                </div>
                <span className={`text-sm font-medium ${color}`}>{strength}</span>
            </div>

            {/* Requirements Checklist - Simplified */}
            <div className="space-y-1">
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${password.length >= 6 ? 'text-green-500' : 'text-red-500'}`}>
                        {password.length >= 6 ? '✓' : '✗'}
                    </span>
                    <span className={password.length >= 6 ? 'text-green-600' : 'text-gray-600'}>
                        At least 6 characters
                    </span>
                </div>
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${/[a-zA-Z]/.test(password) ? 'text-green-500' : 'text-red-500'}`}>
                        {/[a-zA-Z]/.test(password) ? '✓' : '✗'}
                    </span>
                    <span className={/[a-zA-Z]/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                        Contains letters
                    </span>
                </div>
                <div className="flex items-center text-xs">
                    <span className={`mr-2 ${/\d/.test(password) ? 'text-green-500' : 'text-red-500'}`}>
                        {/\d/.test(password) ? '✓' : '✗'}
                    </span>
                    <span className={/\d/.test(password) ? 'text-green-600' : 'text-gray-600'}>
                        Contains numbers (optional)
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

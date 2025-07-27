import React from 'react';

/**
 * Password validation utility functions for frontend (no restrictions)
 */
export const validatePassword = (password) => {
    const errors = [];

    // Only check if password exists
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
 */
export const getPasswordStrength = (password) => {
    // Always return good strength for any non-empty password
    if (!password || password.length === 0) {
        return {
            score: 0,
            strength: 'Enter a password',
            color: 'text-gray-500',
            feedback: ['Password is required']
        };
    }

    return {
        score: 1,
        strength: 'Good',
        color: 'text-green-600',
        feedback: []
    };
};

/**
 * Password Strength Indicator Component
 */
const PasswordStrengthIndicator = ({ password }) => {
    if (!password) return null;

    const { strength, color } = getPasswordStrength(password);
    const { isValid, errors } = validatePassword(password);

    return (
        <div className="mt-2">
            {/* Simple strength display */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex-1 mr-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${password.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                            style={{ width: password.length > 0 ? '100%' : '0%' }}
                        ></div>
                    </div>
                </div>
                <span className={`text-sm font-medium ${color}`}>{strength}</span>
            </div>

            {/* Only show error if password is completely empty */}
            {!isValid && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                    <ul className="list-disc list-inside text-red-600">
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

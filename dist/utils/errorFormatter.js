/**
 * Error Formatter Utility
 *
 * Provides utilities for formatting validation errors into a standardized format.
 * Converts Zod validation errors to match the project's error response structure.
 *
 * @author Raiyan Jiyon
 * @version 1.0.0
 */
/**
 * Format Zod validation errors into standardized error response format
 *
 * Converts Zod validation errors into a structure that matches the project's
 * error response format with detailed field-level error information.
 *
 * @param error - The Zod validation error object
 * @param requestBody - Optional request body to extract actual invalid values
 * @returns Formatted error object with ValidationError structure
 */
export const formatZodError = (error, requestBody) => {
    const errors = {};
    // Process each validation issue from Zod
    error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        // Extract the actual invalid value from request body
        let actualValue = undefined;
        if (requestBody && issue.path.length > 0) {
            try {
                // Navigate through nested object structure to find the invalid value
                actualValue = issue.path.reduce((obj, key) => {
                    if (obj && typeof obj === 'object' && key in obj) {
                        return obj[key];
                    }
                    return undefined;
                }, requestBody);
            }
            catch {
                // If navigation fails, set to undefined
                actualValue = undefined;
            }
        }
        // Create error object in the standardized format
        errors[path] = {
            message: issue.message,
            name: "ValidatorError",
            properties: {
                message: issue.message,
                type: issue.code,
                // Add minimum value for "too_small" errors
                ...(issue.code === "too_small" && "minimum" in issue ? { min: issue.minimum } : {}),
                // Add maximum value for "too_big" errors
                ...(issue.code === "too_big" && "maximum" in issue ? { max: issue.maximum } : {}),
            },
            kind: issue.code,
            path,
            value: actualValue, // Include the actual invalid value
        };
    });
    // Return in ValidationError format
    return {
        name: "ValidationError",
        errors,
    };
};

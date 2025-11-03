export const formatZodError = (error, requestBody) => {
    const errors = {};
    error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        // Try to get the actual value from the request body
        let actualValue = undefined;
        if (requestBody && issue.path.length > 0) {
            try {
                actualValue = issue.path.reduce((obj, key) => obj?.[key], requestBody);
            }
            catch {
                actualValue = undefined;
            }
        }
        errors[path] = {
            message: issue.message,
            name: "ValidatorError",
            properties: {
                message: issue.message,
                type: issue.code,
                ...(issue.code === "too_small" && "minimum" in issue ? { min: issue.minimum } : {}),
                ...(issue.code === "too_big" && "maximum" in issue ? { max: issue.maximum } : {}),
            },
            kind: issue.code,
            path,
            value: actualValue,
        };
    });
    return {
        name: "ValidationError",
        errors,
    };
};

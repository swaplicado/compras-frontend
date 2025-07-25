import React from "react";

/**
 * Validates the type of a file against a list of allowed MIME types.
 * Returns true if the file type is in the allowed types.
 * Returns false if the file is null, allowed types are not provided, or the file type is not in the allowed types.
 * @param file 
 * @param allowedTypes 
 * @returns 
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    if (!file || !allowedTypes || allowedTypes.length === 0) {
        return false;
    }
    return allowedTypes.includes(file.type);
};

/**
 * Validates the size of a file against a maximum size limit in bytes.
 * Returns true if the file size is less than or equal to the maximum size.
 * Returns false if the file is null or the maximum size is less than or equal to zero.
 * Returns false if the file size exceeds the maximum size.
 * @param file 
 * @param maxSizeBytes 
 * @returns 
 */
export const validateFileSize = (file: File, maxSizeBytes: number): boolean => {
    if (!file || maxSizeBytes <= 0) {
        return false;
    }
    return file.size <= maxSizeBytes;
}

/**
 * Validates a file against allowed types and maximum size.
 * Returns true if the file type is valid and the file size is within the limit.
 * Returns false otherwise.
 * @param file 
 * @param allowedTypes 
 * @param maxSizeMB 
 * @returns 
 */
export const validateFile = (file: File, allowedTypes: string[], maxSizeBytes: number): boolean => {
    return validateFileType(file, allowedTypes) && validateFileSize(file, maxSizeBytes);
}
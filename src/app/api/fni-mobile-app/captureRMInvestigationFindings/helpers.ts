export const hasValue = (value: any) => {
  // Check for boolean values (true/false)
  if (typeof value === "boolean") {
    return true;
  }

  // Check for non-empty string
  if (typeof value === "string" && value.trim() !== "") {
    return true;
  }

  // Check for non-empty array
  if (Array.isArray(value)) {
    if (value.length > 0) {
      // Check if any element in the array has a value
      return value.some(hasValue);
    }
    return false;
  }

  // Check for non-empty object
  if (typeof value === "object" && value !== null) {
    if (Object.keys(value).length > 0) {
      // Check if any property in the object has a value
      return Object.values(value).some(hasValue);
    }
    return false;
  }

  // Check for any number (including zero)
  if (typeof value === "number") {
    return true;
  }

  return false; // Default case, if none of the above are true
};

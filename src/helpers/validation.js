/**
 * Reusable validation utility for forms
 * Can be used across any form in the application
 */

export const ValidationRules = {
  // Text validations
  required: (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} é obrigatório`;
    }
    return null;
  },

  email: (value, fieldName) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return `${fieldName} deve ser um email válido`;
    }
    return null;
  },

  phone: (value, fieldName) => {
    const phoneRegex = /^[0-9]{9,15}$/;
    if (value && !phoneRegex.test(value.toString().replace(/\D/g, ''))) {
      return `${fieldName} deve conter entre 9 e 15 dígitos`;
    }
    return null;
  },

  minLength: (minLen) => (value, fieldName) => {
    if (value && value.toString().length < minLen) {
      return `${fieldName} deve ter no mínimo ${minLen} caracteres`;
    }
    return null;
  },

  maxLength: (maxLen) => (value, fieldName) => {
    if (value && value.toString().length > maxLen) {
      return `${fieldName} deve ter no máximo ${maxLen} caracteres`;
    }
    return null;
  },

  minValue: (minVal) => (value, fieldName) => {
    if (value && Number(value) < minVal) {
      return `${fieldName} deve ser no mínimo ${minVal}`;
    }
    return null;
  },

  maxValue: (maxVal) => (value, fieldName) => {
    if (value && Number(value) > maxVal) {
      return `${fieldName} deve ser no máximo ${maxVal}`;
    }
    return null;
  },

  number: (value, fieldName) => {
    if (value && isNaN(Number(value))) {
      return `${fieldName} deve ser um número válido`;
    }
    return null;
  },

  year: (value, fieldName) => {
    const year = Number(value);
    const currentYear = new Date().getFullYear();
    if (value && (year < 1800 || year > currentYear + 10)) {
      return `${fieldName} deve estar entre 1800 e ${currentYear + 10}`;
    }
    return null;
  },

  url: (value, fieldName) => {
    try {
      if (value) {
        new URL(value);
      }
    } catch (_) {
      return `${fieldName} deve ser uma URL válida`;
    }
    return null;
  },
};

/**
 * Validate a single field with multiple rules
 * @param {any} value - The value to validate
 * @param {array} rules - Array of validation rules or functions
 * @param {string} fieldName - Name of the field for error messages
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (value, rules = [], fieldName = 'Campo') => {
  for (const rule of rules) {
    if (typeof rule === 'function') {
      const error = rule(value, fieldName);
      if (error) return error;
    }
  }
  return null;
};

/**
 * Validate an entire form with multiple fields
 * @param {object} formData - The form data object
 * @param {object} validationSchema - Schema defining validation rules for each field
 * @returns {object} Object with field names as keys and error messages as values
 * 
 * Example schema:
 * {
 *   name: {
 *     rules: [ValidationRules.required, ValidationRules.minLength(2)],
 *     label: 'Nome'
 *   },
 *   email: {
 *     rules: [ValidationRules.required, ValidationRules.email],
 *     label: 'Email'
 *   }
 * }
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};

  for (const [fieldName, config] of Object.entries(validationSchema)) {
    const { rules = [], label = fieldName } = config;
    const value = formData[fieldName];
    const error = validateField(value, rules, label);

    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
};

/**
 * Check if form has any errors
 * @param {object} errors - 
 * @returns {boolean} True if no errors, false if there are errors
 */
export const isFormValid = (errors = {}) => {
  return Object.keys(errors).length === 0;
};

/**
 * Common validation schemas for reuse
 */
export const CommonValidationSchemas = {
  address: {
    houseType: {
      rules: [ValidationRules.required],
      label: 'Tipo de Imóvel',
    },
    businessType: {
      rules: [ValidationRules.required],
      label: 'Tipo de Negócio',
    },
    fullAddress: {
      rules: [ValidationRules.required],
      label: 'Localização do Imóvel',
    },
  },

  contact: {
    name: {
      rules: [ValidationRules.minLength(2)],
      label: 'Nome',
    },
    phone: {
      rules: [ValidationRules.phone],
      label: 'Telefone',
    },
    email: {
      rules: [ValidationRules.email],
      label: 'Email',
    },
  },

  property: {
    builtArea: {
      rules: [ValidationRules.number],
      label: 'Área Construída',
    },
    usableArea: {
      rules: [ValidationRules.number],
      label: 'Área Útil',
    },
    grossArea: {
      rules: [ValidationRules.number],
      label: 'Área Bruta',
    },
    constructionYear: {
      rules: [ValidationRules.year],
      label: 'Ano de Construção',
    },
    price: {
      rules: [ValidationRules.number, ValidationRules.minValue(0)],
      label: 'Preço',
    },
    rooms: {
      rules: [ValidationRules.number],
      label: 'Quartos',
    },
    bathrooms: {
      rules: [ValidationRules.number],
      label: 'Casas de Banho',
    },
  },

  media: {
    videoUrl: {
      rules: [ValidationRules.url],
      label: 'URL do Vídeo',
    },
  },
};

// Validation utilities for the cinema app
export const validateEmail = (email) => {
    // Regex pattern để kiểm tra email hợp lệ theo chuẩn RFC 5322
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // Ít nhất 6 ký tự, có chữ hoa, chữ thường và số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
};

export const validatePhone = (phone) => {
    // Số điện thoại Việt Nam: 10-11 số, bắt đầu bằng 0
    const phoneRegex = /^0[0-9]{9,10}$/;
    return phoneRegex.test(phone);
};

export const validateName = (name) => {
    // Tên phải có ít nhất 2 ký tự, chỉ chứa chữ cái và khoảng trắng
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơ\s]{2,}$/;
    return nameRegex.test(name.trim());
};

export const validateRequired = (value, fieldName) => {
    if (!value || value.trim().length === 0) {
        return `${fieldName} không được để trống`;
    }
    return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
    if (value && value.length < minLength) {
        return `${fieldName} phải có ít nhất ${minLength} ký tự`;
    }
    return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
    if (value && value.length > maxLength) {
        return `${fieldName} không được vượt quá ${maxLength} ký tự`;
    }
    return null;
};

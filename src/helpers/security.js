const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        return hash;
    } catch (error) {
        console.error("Error hashing password: ", error.message)
    }
}

const verifyPassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error verifying password: ", error.message)
    }
}

const isStrong = (password) => {
    const hasNumber = /\d/;
    const hasCapitalLetter = /[A-Z]/;
    const hasSpecialCharacter = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/;

    let response = {
        message: '',
        isSafe: false
    }

    if (password.length < 6) {
        response.message = 'The password must contain 6 characters or more';
    } else if (!hasNumber.test(password)) {
        response.message = 'The password must contain at least one number';
    } else if (!hasCapitalLetter.test(password)) {
        response.message = 'The password must contain at least one capital letter';
    } else if (!hasSpecialCharacter.test(password)) {
        response.message = 'The password must contain at least one special character';
    } else {
        response.isSafe = true;
    }

    return response;
}

export {hashPassword, verifyPassword, isStrong};
const form = document.getElementById("contact-form");

//Validation rules
const isRequired = (value) => value.trim() !== '' ? null : 'This field is required.';
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Please eneter a valid email address';
const isChecked = (input) => input.checked ? null : 'To submiit form, please consent to being contacted';
const isRadioChecked = (name, form) => {
    const radios = form.querySelectorAll(`[name="${name}"]`);
    for (const radio of radios) {
        if (radio.checked) return null;
    }
    return 'Please select a query type';
};

const runValidators = (value, validators, form, name) => {
    for (const validator of validators) {
        const error = validator(value, form, name);
        if (error) {
            return error;
        }
    }
    return null;
}

const validateForm = (form) => {
    const errors = {};
    const validationRules = {
        firstname: [isRequired],
        lastname: [isRequired],
        email: [isRequired, isValidEmail],
        message: [isRequired],
        consent: [(value, form, name) => {
            const input = form.querySelector(`[name="${name}"]`);
            return input ? isChecked(input) : 'This field is required.';
        }],
        query: [(value, form) => isRadioChecked('query', form)],
    };

    for (const [name, rules] of Object.entries(validationRules)) {
        const input = form.querySelector(`[name="${name}"]`);
        if (input.type === 'radio') {
            const error = runValidators(null, rules, form, name);
            if (error) {
                errors[name] = error;
            }
        } else {
            const value = input.value;
            const error = runValidators(value, rules, form, name);
            if (error) {
                errors[name] = error;
            }
        }
    }
    return errors;
};

const handleFormSubmission = (event) => {
    event.preventDefault();
    const modal = document.querySelector('.modal-container');
    const form = event.target;
    const errors = validateForm(form);
    form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    if (Object.keys(errors).length > 0) {
        for (const field in errors) {
            const errorElement = form.querySelector(`.error-msg[data-for="${field}"]`);
            if (errorElement) {
                errorElement.textContent = errors[field];
            }
        }
        const firstErrorField = form.querySelector(`[name="${Object.keys(errors)[0]}"]`);
        firstErrorField.focus();
    } else {
        console.log('Form Submitted Successfully');
        modal.style.display = "block";

        setTimeout(() => {
            modal.style.display = "none";
        }, 3000);
    }
};

form.addEventListener("submit", handleFormSubmission);

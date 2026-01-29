import { useReducer } from 'react';
import config from '../config';

const formInitialState = {
    status: 'idle', // 'idle', 'submitting', 'success', 'error'
    message: null,
};

function formReducer(state, action) {
    switch (action.type) {
        case 'SUBMIT':
            return { ...state, status: 'submitting', message: null };
        case 'SUCCESS':
            return { ...state, status: 'success', message: action.payload };
        case 'ERROR':
            return { ...state, status: 'error', message: action.payload };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

const useContactForm = () => {
    const [formState, dispatch] = useReducer(formReducer, formInitialState);

    const submitForm = async (data) => {
        dispatch({ type: 'SUBMIT' });

        try {
            const response = await fetch(config.formSubmitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                dispatch({ type: 'SUCCESS', payload: 'Thanks for your message! I will get back to you soon.' });
                return true;
            } else {
                const responseData = await response.json();
                const errorMessage = responseData.errors
                    ? responseData.errors.map(error => error.message).join(", ")
                    : 'Oops! There was a problem submitting your form';
                dispatch({ type: 'ERROR', payload: errorMessage });
                return false;
            }
        } catch (error) {
            dispatch({ type: 'ERROR', payload: 'Something went wrong. Please try again.' });
            return false;
        }
    };

    return { formState, submitForm };
};

export default useContactForm;

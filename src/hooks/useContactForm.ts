import { useReducer } from 'react';
import config from '../config';

interface FormState {
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string | null;
}

type FormAction = 
    | { type: 'SUBMIT' }
    | { type: 'SUCCESS'; payload: string }
    | { type: 'ERROR'; payload: string };

const formInitialState: FormState = {
    status: 'idle',
    message: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SUBMIT':
            return { ...state, status: 'submitting', message: null };
        case 'SUCCESS':
            return { ...state, status: 'success', message: action.payload };
        case 'ERROR':
            return { ...state, status: 'error', message: action.payload };
        default:
            return state;
    }
}

const useContactForm = () => {
    const [formState, dispatch] = useReducer(formReducer, formInitialState);

    const submitForm = async (data: Record<string, any>) => {
        dispatch({ type: 'SUBMIT' });

        try {
            const response = await fetch(config.formSubmitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    _captcha: 'false'
                })
            });

            if (response.ok) {
                dispatch({ type: 'SUCCESS', payload: 'Thanks for your message! I will get back to you soon.' });
                return true;
            } else {
                const responseData = await response.json();
                const errorMessage = responseData.errors
                    ? responseData.errors.map((error: any) => error.message).join(", ")
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

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
            const response = await fetch('/api/public/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    subject: data._subject,
                    type: data.inquiryType,
                    message: data.message
                })
            });

            if (response.ok) {
                dispatch({ type: 'SUCCESS', payload: 'Thanks for your message! I will get back to you soon.' });
                return true;
            } else {
                const responseData = await response.json();
                dispatch({ type: 'ERROR', payload: responseData.error || 'Oops! There was a problem submitting your form' });
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

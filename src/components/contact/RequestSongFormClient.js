"use client";

import React, { useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const formInitialState = {
    status: 'idle',
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
        case 'RESET':
            return formInitialState;
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

const RequestSongFormClient = () => {
    const [formState, dispatch] = useReducer(formReducer, formInitialState);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT' });

        const form = e.target;
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        try {
            const response = await fetch('https://formsubmit.co/ajax/7bcff6a4aef91c254d8c32aaf5b0214d', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                dispatch({ type: 'SUCCESS', payload: 'Your song suggestion has been received! I\'ll give it a listen and might even cover it if I like it.' });
                form.reset();
            } else {
                const responseData = await response.json();
                const errorMessage = responseData.errors
                    ? responseData.errors.map(error => error.message).join(", ")
                    : 'Oops! There was a problem submitting your form';
                dispatch({ type: 'ERROR', payload: errorMessage });
            }
        } catch (error) {
            dispatch({ type: 'ERROR', payload: 'Something went wrong. Please try again.' });
        }
    };

    return (
        <div className="card-elevated p-8 sm:p-10 rounded-2xl max-w-2xl w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">Request a Song</h2>
                <p className="text-[var(--text-secondary)]">Have a song you'd love to hear me cover? Let me know!</p>
            </div>

            <AnimatePresence mode="wait">
                {formState.status !== 'success' ? (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="songName" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                    Song Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="songName"
                                    id="songName"
                                    className="input-modern"
                                    placeholder="Enter song name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="artist" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                    Original Artist
                                </label>
                                <input
                                    type="text"
                                    name="artist"
                                    id="artist"
                                    className="input-modern"
                                    placeholder="Artist name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="input-modern"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[var(--text-secondary)]">
                                    Your Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="input-modern"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                            disabled={formState.status === 'submitting'}
                        >
                            {formState.status === 'submitting' ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending Request...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Submit Request
                                </>
                            )}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
                        >
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Thank You!</h3>
                        <p className="text-[var(--text-secondary)] mb-8">{formState.message}</p>
                        <button
                            onClick={() => router.back()}
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go Back
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {formState.status === 'error' && (
                <motion.div
                    className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-red-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {formState.message}
                </motion.div>
            )}
        </div>
    );
};

export default RequestSongFormClient;

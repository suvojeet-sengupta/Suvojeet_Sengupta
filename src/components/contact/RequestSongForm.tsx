import React, { useReducer } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Button from '../common/Button';

// Type definitions for form state
interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string | null;
}

type FormAction = 
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; payload: string }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' };

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
    case 'RESET':
      return formInitialState;
    default:
      return state;
  }
}

const RequestSongForm = () => {
  const [formState, dispatch] = useReducer(formReducer, formInitialState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'SUBMIT' });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

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
          ? responseData.errors.map((error: any) => error.message).join(", ")
          : 'Oops! There was a problem submitting your form';
        dispatch({ type: 'ERROR', payload: errorMessage });
      }
    } catch (error) {
      dispatch({ type: 'ERROR', payload: 'Something went wrong. Please try again.' });
    }
  };

  const formContainerVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <div className="bg-tertiary p-8 rounded-sm border border-light max-w-3xl w-full">
        <h2 className="text-3xl font-black mb-8 text-primary uppercase tracking-tighter text-center">Request a Song</h2>
        <AnimatePresence mode="wait">
          {formState.status !== 'success' ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={formContainerVariants}
              initial="visible"
              exit="exit"
            >
              <div className="space-y-2">
                <label htmlFor="songName" className="text-xs font-black uppercase tracking-widest text-muted">Song Name</label>
                <input type="text" name="songName" id="songName" className="w-full bg-background border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary" placeholder="Enter song title" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="artist" className="text-xs font-black uppercase tracking-widest text-muted">Artist</label>
                <input type="text" name="artist" id="artist" className="w-full bg-background border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary" placeholder="Original artist" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted">Your Name</label>
                  <input type="text" name="name" id="name" className="w-full bg-background border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary" placeholder="Suvojeet" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted">Your Email</label>
                  <input type="email" name="email" id="email" className="w-full bg-background border border-light p-3 focus:border-brand-orange outline-none transition-colors rounded-sm text-primary" placeholder="suvojeet@example.com" required />
                </div>
              </div>
              <Button type="submit" primary className="w-full py-4 text-lg" disabled={formState.status === 'submitting'}>
                {formState.status === 'submitting' ? 'SENDING...' : 'SUBMIT REQUEST'}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              className="text-center py-10"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-brand-orange flex items-center justify-center text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Suggestion Received</h3>
              <p className="text-secondary font-medium mb-8">{formState.message}</p>
              <Button onClick={() => window.history.back()} primary className="px-10">GO BACK</Button>
            </motion.div>
          )}
        </AnimatePresence>
        {formState.status === 'error' && (
            <div className="mt-6 text-center text-red-500 font-bold uppercase text-xs">{formState.message}</div>
          )}
    </div>
  );
};

export default RequestSongForm;

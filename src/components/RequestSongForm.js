import React, { useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

// Reducer function for form state management
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
    case 'RESET':
      return formInitialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const RequestSongForm = ({ onClose }) => {
  const [formState, dispatch] = useReducer(formReducer, formInitialState);

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
        dispatch({ type: 'SUCCESS', payload: 'Thanks for your song suggestion! I will check it out.' });
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

  const formContainerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-dark-2 p-8 rounded-lg shadow-lg max-w-3xl w-full relative">
        <button onClick={() => {
          dispatch({type: 'RESET'});
          onClose();
        }} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-3xl font-bold text-center font-montserrat mb-8 text-white">Request a Song</h2>
        <AnimatePresence>
          {formState.status !== 'success' ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={formContainerVariants}
              initial="visible"
              exit="exit"
            >
              <div>
                <label htmlFor="songName" className="block mb-2 font-semibold text-grey">Song Name</label>
                <input type="text" name="songName" id="songName" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required />
              </div>
              <div>
                <label htmlFor="artist" className="block mb-2 font-semibold text-grey">Artist</label>
                <input type="text" name="artist" id="artist" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" />
              </div>
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-grey">Your Name</label>
                <input type="text" name="name" id="name" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-grey">Your Email</label>
                <input type="email" name="email" id="email" className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:ring-primary focus:border-primary text-white" required />
              </div>
              <Button type="submit" primary className="w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={formState.status === 'submitting'}>
                {formState.status === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              key="success-message"
              className="text-center"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
              >
                <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-grey">{formState.message}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {formState.status === 'error' && (
            <div className="mt-6 text-center text-red-500">{formState.message}</div>
          )}
      </div>
    </div>
  );
};

export default RequestSongForm;

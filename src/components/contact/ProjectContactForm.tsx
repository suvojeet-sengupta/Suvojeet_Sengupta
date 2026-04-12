'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useContactForm from '@/hooks/useContactForm';

interface ProjectContactFormProps {
    projectName: string;
}

const ProjectContactForm: React.FC<ProjectContactFormProps> = ({ projectName }) => {
    const { formState, submitForm } = useContactForm();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interest: 'Bug Report',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await submitForm({
            ...formData,
            _subject: `[Project: ${projectName}] New Inquiry from ${formData.name}`,
            project: projectName
        });
        
        if (success) {
            setFormData({
                name: '',
                email: '',
                interest: 'Bug Report',
                message: ''
            });
        }
    };

    return (
        <div className="professional-card border-brand-orange">
            <h3 className="text-xl font-bold mb-6">Project Inquiry</h3>
            <AnimatePresence mode="wait">
                {formState.status !== 'success' ? (
                    <motion.form 
                        key="form"
                        onSubmit={handleSubmit} 
                        className="space-y-4"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="space-y-1">
                            <label htmlFor="name-proj" className="text-xs font-black uppercase tracking-widest text-muted">Name</label>
                            <input 
                                type="text" 
                                id="name-proj" 
                                name="name" 
                                required 
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-tertiary border border-light p-2 focus:border-brand-orange outline-none transition-colors rounded-sm text-sm"
                                placeholder="Suvojeet"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="email-proj" className="text-xs font-black uppercase tracking-widest text-muted">Email</label>
                            <input 
                                type="email" 
                                id="email-proj" 
                                name="email" 
                                required 
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-tertiary border border-light p-2 focus:border-brand-orange outline-none transition-colors rounded-sm text-sm"
                                placeholder="suvojeet@example.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="interest-proj" className="text-xs font-black uppercase tracking-widest text-muted">Interest</label>
                            <select 
                                id="interest-proj" 
                                name="interest" 
                                value={formData.interest}
                                onChange={handleChange}
                                className="w-full bg-tertiary border border-light p-2 focus:border-brand-orange outline-none transition-colors rounded-sm text-sm"
                            >
                                <option value="Bug Report">Bug Report</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Collaboration">Collaboration</option>
                                <option value="Optimization Idea">Optimization Idea</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="message-proj" className="text-xs font-black uppercase tracking-widest text-muted">Message</label>
                            <textarea 
                                id="message-proj" 
                                name="message" 
                                rows={3}
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-tertiary border border-light p-2 focus:border-brand-orange outline-none transition-colors rounded-sm text-sm resize-none"
                                placeholder={`How can we improve ${projectName}?`}
                            ></textarea>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn-solid w-full text-sm py-3"
                            disabled={formState.status === 'submitting'}
                        >
                            {formState.status === 'submitting' ? 'SENDING...' : 'SEND INQUIRY'}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        className="text-center py-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="w-12 h-12 mx-auto mb-4 rounded-sm bg-brand-orange flex items-center justify-center text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-widest">Sent!</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectContactForm;

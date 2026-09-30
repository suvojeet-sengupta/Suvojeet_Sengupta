'use client';

import React, { useState } from 'react';
import useContactForm from '@/hooks/useContactForm';

export type InquiryType = 'GENERAL' | 'SONG' | 'PROJECT';

interface ModularContactFormProps {
    initialType?: InquiryType;
    projectName?: string; // Set when the form lives on a project page
}

const TYPE_LABELS: Record<InquiryType, string> = {
    GENERAL: 'General',
    PROJECT: 'Project',
    SONG: 'Song request',
};

const EMPTY_FORM = {
    name: '',
    email: '',
    message: '',
    songName: '',
    artistName: '',
    interest: 'General',
};

const ModularContactForm: React.FC<ModularContactFormProps> = ({ initialType = 'GENERAL', projectName }) => {
    const { formState, submitForm, resetForm } = useContactForm();
    const [type, setType] = useState<InquiryType>(initialType);
    const [formData, setFormData] = useState<Record<string, string>>(EMPTY_FORM);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleReset = () => {
        resetForm();
        setFormData(EMPTY_FORM);
        setType(initialType);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let subject = `New message from ${formData.name}`;
        let message = formData.message;
        if (type === 'SONG') {
            subject = `Song request: ${formData.songName} (${formData.name})`;
            message = `Song: ${formData.songName}\nOriginal artist: ${formData.artistName}\n\n${formData.message}`;
        }
        if (type === 'PROJECT') {
            subject = `Project inquiry: ${projectName || 'General'} (${formData.name})`;
            message = `Project: ${projectName || 'New collaboration'}\nTopic: ${formData.interest}\n\n${formData.message}`;
        }

        await submitForm({
            ...formData,
            message,
            inquiryType: type,
            _subject: subject,
            projectName: projectName || 'N/A',
        });
    };

    if (formState.status === 'success') {
        return (
            <div className="py-10" role="status">
                <h3 className="text-[28px] mb-3">Message sent.</h3>
                <p className="text-[16px] max-w-md">{formState.message}</p>
                <button onClick={handleReset} className="text-link mt-6 text-[15px]">
                    Send another message
                </button>
            </div>
        );
    }

    const submitting = formState.status === 'submitting';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {!projectName && (
                <fieldset>
                    <legend className="v-label">What is this about?</legend>
                    <div className="flex flex-wrap gap-2" role="radiogroup">
                        {(['GENERAL', 'PROJECT', 'SONG'] as InquiryType[]).map((t) => (
                            <button
                                key={t}
                                type="button"
                                role="radio"
                                aria-checked={type === t}
                                onClick={() => setType(t)}
                                className={`px-4 py-2 rounded-full text-[14px] border transition-colors ${
                                    type === t
                                        ? 'bg-[color:var(--text-primary)] text-[color:var(--bg-primary)] border-[color:var(--text-primary)]'
                                        : 'border-[color:var(--line-strong)] text-[color:var(--text-secondary)] hover:border-[color:var(--text-primary)]'
                                }`}
                            >
                                {TYPE_LABELS[t]}
                            </button>
                        ))}
                    </div>
                </fieldset>
            )}

            <div className="grid md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="name" className="v-label">Name</label>
                    <input
                        type="text" id="name" name="name" required autoComplete="name"
                        value={formData.name} onChange={handleChange} className="v-input"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="v-label">Email</label>
                    <input
                        type="email" id="email" name="email" required autoComplete="email"
                        value={formData.email} onChange={handleChange} className="v-input"
                    />
                </div>
            </div>

            {type === 'SONG' && (
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="songName" className="v-label">Song</label>
                        <input
                            type="text" id="songName" name="songName" required
                            value={formData.songName} onChange={handleChange} className="v-input"
                            placeholder="e.g. Tum Hi Ho"
                        />
                    </div>
                    <div>
                        <label htmlFor="artistName" className="v-label">Original artist</label>
                        <input
                            type="text" id="artistName" name="artistName" required
                            value={formData.artistName} onChange={handleChange} className="v-input"
                            placeholder="e.g. Arijit Singh"
                        />
                    </div>
                </div>
            )}

            {type === 'PROJECT' && (
                <div className="grid md:grid-cols-2 gap-5">
                    {projectName && (
                        <div>
                            <span className="v-label">Project</span>
                            <p className="v-input !bg-transparent !border-[color:var(--line)] text-[color:var(--text-tertiary)]">{projectName}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="interest" className="v-label">Topic</label>
                        <select id="interest" name="interest" value={formData.interest} onChange={handleChange} className="v-input cursor-pointer">
                            <option value="General">General question</option>
                            <option value="Bug Report">Bug report</option>
                            <option value="Feature Request">Feature request</option>
                            <option value="Collaboration">Collaboration or hiring</option>
                        </select>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="message" className="v-label">
                    {type === 'SONG' ? 'Anything I should know? (a dedication, a memory)' : 'Message'}
                </label>
                <textarea
                    id="message" name="message" rows={5} required
                    value={formData.message} onChange={handleChange}
                    className="v-input resize-y min-h-[140px]"
                />
            </div>

            <div className="flex flex-wrap items-center gap-5">
                <button type="submit" className="btn-solid disabled:opacity-60" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send message'}
                </button>
                {formState.status === 'error' && (
                    <p role="alert" className="text-[14px] text-[#c2553b]">
                        {formState.message}
                    </p>
                )}
            </div>
        </form>
    );
};

export default ModularContactForm;

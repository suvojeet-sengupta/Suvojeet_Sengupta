import ModularContactForm from "@/components/contact/ModularContactForm";

export const metadata = {
    title: 'Contact | Suvojeet Sengupta',
    description: 'Get in touch for development, music, or general inquiries.',
};

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20">
            <div className="section-container max-w-3xl">
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter">
                        Contact <span className="text-accent">Me</span>
                    </h1>
                    <p className="text-xl text-secondary max-w-xl font-medium leading-relaxed">
                        Whether you need a high-performance app, a soulful song cover, or just want to connect, feel free to reach out.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 professional-card">
                        <ModularContactForm initialType="GENERAL" />
                    </div>
                    
                    <div className="space-y-8">
                        <div className="p-6 bg-tertiary border-l-4 border-brand-orange rounded-sm">
                            <h3 className="font-black uppercase tracking-widest text-xs mb-4">Response Time</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                I typically respond to all inquiries within 24-48 hours. Please provide as much detail as possible so I can get back to you effectively.
                            </p>
                        </div>
                        
                        <div className="p-6 border border-light rounded-sm">
                            <h3 className="font-black uppercase tracking-widest text-xs mb-4">What to expect</h3>
                            <ul className="space-y-3 text-sm text-secondary">
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-orange font-bold">01.</span>
                                    <span>Select the type of inquiry.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-orange font-bold">02.</span>
                                    <span>Fill out the required details.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-orange font-bold">03.</span>
                                    <span>I review and reach out to you via email!</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


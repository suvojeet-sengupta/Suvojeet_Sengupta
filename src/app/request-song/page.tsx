import ModularContactForm from "@/components/contact/ModularContactForm";

export const metadata = {
    title: 'Song Request | Suvojeet Sengupta',
    description: 'Dedicate a song or request a soulful cover by Suvojeet Sengupta.',
};

export default function RequestSongPage() {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20">
            <div className="section-container max-w-3xl">
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter">
                        Song <span className="text-accent">Request</span>
                    </h1>
                    <p className="text-xl text-secondary max-w-xl font-medium leading-relaxed">
                        Music is better when it's shared. Tell me which song touches your soul, and I'll try to bring it to life in my own style.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 professional-card">
                        <ModularContactForm initialType="SONG" />
                    </div>
                    
                    <div className="space-y-8">
                        <div className="p-6 bg-tertiary border-l-4 border-brand-orange rounded-sm">
                            <h3 className="font-black uppercase tracking-widest text-xs mb-4">Note</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                I review every request personally. While I can't record every song, I prioritize those with a meaningful story or dedication.
                            </p>
                        </div>
                        
                        <div className="p-6 border border-light rounded-sm">
                            <h3 className="font-black uppercase tracking-widest text-xs mb-4">What happens next?</h3>
                            <ul className="space-y-3 text-sm text-secondary">
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-orange font-bold">01.</span>
                                    <span>I listen to the original track.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-orange font-bold">02.</span>
                                    <span>If it fits my vocal texture, I'll arrange a cover.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-brand-orange font-bold">03.</span>
                                    <span>I'll notify you via email if it's selected!</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

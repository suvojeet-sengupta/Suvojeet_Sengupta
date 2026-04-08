import RequestSongFormClient from "@/components/contact/RequestSongFormClient";

export const metadata = {
    title: 'Request a Song | Suvojeet Sengupta',
    description: 'Request a song for Suvojeet Sengupta to cover. Share your favorite songs and get a chance to hear his version.',
};

export default function RequestSongPage() {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20">
            <div className="section-container max-w-2xl">
                <h1 className="text-5xl font-black mb-4">Request a <span className="text-accent">Song</span></h1>
                <p className="text-secondary mb-12">Share your favorite tracks and I might just record a cover for you.</p>
                <div className="professional-card">
                    <RequestSongFormClient />
                </div>
            </div>
        </div>
    );
}

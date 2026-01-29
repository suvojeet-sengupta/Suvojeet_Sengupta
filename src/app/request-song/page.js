import RequestSongFormClient from "@/components/contact/RequestSongFormClient";

export const metadata = {
    title: 'Request a Song | Suvojeet Sengupta',
    description: 'Request a song for Suvojeet Sengupta to cover. Share your favorite songs and get a chance to hear his version.',
};

export default function RequestSongPage() {
    return (
        <div className="bg-dark text-white min-h-screen flex items-center justify-center p-4">
            <RequestSongFormClient />
        </div>
    );
}

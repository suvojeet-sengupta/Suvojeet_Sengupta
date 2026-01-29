export const runtime = 'edge';

import VideoPageClient from "@/components/video/VideoPageClient";
import videos from '@/data/videos.json';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const video = videos.find((v) => v.id === id);

    if (!video) {
        return {
            title: 'Video Not Found',
        };
    }

    return {
        title: `${video.title} - Suvojeet Sengupta`,
        description: video.description,
        openGraph: {
            title: `${video.title} - Suvojeet Sengupta`,
            description: video.description,
            images: [
                {
                    url: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
                    width: 1280,
                    height: 720,
                }
            ],
            type: 'video.other',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${video.title} - Suvojeet Sengupta`,
            description: video.description,
            images: [`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`],
        },
    };
}

export default function VideoPage() {
    return <VideoPageClient />;
}

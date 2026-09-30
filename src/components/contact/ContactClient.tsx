import ModularContactForm from '@/components/contact/ModularContactForm';
import SocialLinks from '@/components/contact/SocialLinks';

const EMAILS = [
    { label: 'General', address: 'suvojeet@suvojeetsengupta.in' },
    { label: 'App support', address: 'support@suvojeetsengupta.in' },
];

export default function ContactClient() {
    return (
        <div className="page">
            <header className="max-w-3xl">
                <p className="page-eyebrow">Contact</p>
                <h1 className="page-title">Get in touch</h1>
                <p className="page-lede">
                    For roles, freelance projects, collaborations or a song request. I read
                    every message myself and usually reply within one or two days.
                </p>
            </header>

            <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20 mt-16 pt-10 border-t border-[color:var(--line-strong)]">
                <ModularContactForm initialType="GENERAL" />

                <aside className="space-y-10">
                    <div>
                        <h2 className="text-[13px] font-sans text-[color:var(--text-muted)] tracking-normal mb-4">Email</h2>
                        <dl className="space-y-4">
                            {EMAILS.map((e) => (
                                <div key={e.address}>
                                    <dt className="text-[14px] text-[color:var(--text-tertiary)]">{e.label}</dt>
                                    <dd>
                                        <a href={`mailto:${e.address}`} className="text-link text-[16px] break-all">
                                            {e.address}
                                        </a>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div>
                        <h2 className="text-[13px] font-sans text-[color:var(--text-muted)] tracking-normal mb-4">Elsewhere</h2>
                        <SocialLinks />
                    </div>

                    <div>
                        <h2 className="text-[13px] font-sans text-[color:var(--text-muted)] tracking-normal mb-4">Based in</h2>
                        <p className="text-[16px]">Dhanbad, Jharkhand, India (IST, UTC+5:30)</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

import { Game } from '@/lib/types';

export function GameSchema({ game }: { game: Game }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": game.gameName,
        "applicationCategory": "Game",
        "operatingSystem": "Roblox",
        "description": game.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `How to redeem codes in ${game.gameName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Open the game, find the Twitter/Codes icon, enter the code, and click Redeem."
                }
            },
            {
                "@type": "Question",
                "name": `Are there any working codes for ${game.gameName}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Yes, there are currently ${game.codes.filter(c => c.status === 'active').length} active codes available.`
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}

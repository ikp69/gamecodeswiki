'use client';

import { Code, Game } from '@/lib/types';
import { Copy, Check, AlertCircle, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useUsedCodes } from '@/lib/usedCodes';

export function CodesTable({ codes, game }: { codes: Code[]; game: Game }) {
    const activeCodes = codes.filter(c => c.status === 'active');
    const expiredCodes = codes.filter(c => c.status === 'expired');
    const [showExpired, setShowExpired] = useState(false);
    const { isUsed, markAsUsed } = useUsedCodes();

    return (
        <div className="space-y-8">
            {/* Active Codes */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-green-400">✅</span> All New {game.gameName.match(/codes$/i) ? game.gameName : `${game.gameName}`}
                    </h2>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
                        Highlighted = Already Used
                    </div>
                </div>
                {activeCodes.length > 0 ? (
                    <div className="glass rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5 text-xs uppercase text-muted-foreground">
                                        <th className="p-4 font-medium">Code</th>
                                        <th className="p-4 font-medium">Reward</th>
                                        <th className="p-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {activeCodes.map((code, idx) => (
                                        <CodeRow
                                            key={idx}
                                            code={code}
                                            isUsed={isUsed(code.code)}
                                            onCopy={() => markAsUsed(code.code)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 glass rounded-xl text-center text-muted-foreground">
                        No active codes currently available. Check back soon!
                    </div>
                )}
            </section>

            {/* Expired Codes Accordion */}
            {expiredCodes.length > 0 && (
                <section>
                    <button
                        onClick={() => setShowExpired(!showExpired)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                        aria-expanded={showExpired}
                    >
                        <AlertCircle className="w-4 h-4" />
                        {showExpired ? 'Hide' : `Show ${expiredCodes.length}`} Expired Codes (For Reference)
                    </button>

                    {showExpired && (
                        <div className="glass rounded-xl overflow-hidden grayscale opacity-70">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5 text-xs uppercase text-muted-foreground">
                                            <th className="p-4 font-medium">Code</th>
                                            <th className="p-4 font-medium">Reward</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {expiredCodes.map((code, idx) => (
                                            <tr key={idx}>
                                                <td className="p-4 font-mono text-sm text-muted-foreground line-through">{code.code}</td>
                                                <td className="p-4 text-sm text-muted-foreground">{code.reward}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

function CodeRow({ code, isUsed, onCopy }: { code: Code; isUsed: boolean; onCopy: () => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code.code);
        setCopied(true);
        onCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <tr className={cn(
            "group transition-all duration-300",
            isUsed ? "bg-primary/5 opacity-60" : "hover:bg-white/5"
        )}>
            <td className="p-4 font-mono font-bold text-primary text-base sm:text-lg">
                <div className="flex items-center gap-2">
                    {code.code}
                    {isUsed && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/20 text-[10px] text-primary uppercase font-black tracking-wider">
                            Used
                        </span>
                    )}
                </div>
            </td>
            <td className="p-4 text-sm font-medium">{code.reward}</td>
            <td className="p-4 text-right">
                <button
                    onClick={handleCopy}
                    className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        copied
                            ? "bg-green-500 text-white"
                            : isUsed
                                ? "bg-white/10 text-white hover:bg-white/20"
                                : "bg-primary text-white hover:bg-primary/90"
                    )}
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                    ) : (
                        <>
                            {isUsed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {isUsed ? 'Used' : 'Copy'}
                        </>
                    )}
                </button>
            </td>
        </tr>
    );
}

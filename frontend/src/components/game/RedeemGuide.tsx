import { Game } from '@/lib/types';
import { Gamepad2, Gift } from 'lucide-react';

export function RedeemGuide({ game }: { game: Game }) {
    return (
        <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" /> How to Redeem {game.gameName}
            </h2>

            <div className="space-y-6 relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-white/5" />

                <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 z-10">1</div>
                    <div>
                        <h3 className="font-bold text-foreground">Launch the Game</h3>
                        <p className="text-sm text-muted-foreground mt-1">Open <strong>{game.gameName} </strong> in Roblox on your PC or Mobile device.</p>
                    </div>
                </div>

                <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 z-10">2</div>
                    <div>
                        <h3 className="font-bold text-foreground">Find the Menu</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Look for the <strong className="text-white">Twitter icon</strong>, <strong className="text-white">Codes button</strong>, or check the settings menu.
                        </p>
                    </div>
                </div>

                <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 z-10">3</div>
                    <div>
                        <h3 className="font-bold text-foreground">Enter Code</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Copy a code from our list, paste it into the box, and hit <strong className="text-white">Redeem</strong> to get your rewards!
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <Gamepad2 className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm">
                    <p className="text-blue-200 font-medium mb-1">Still having trouble?</p>
                    <p className="text-blue-300/80">
                        Make sure you are typing the code exactly as it appears. Codes are often case-sensitive!
                    </p>
                </div>
            </div>
        </div>
    );
}

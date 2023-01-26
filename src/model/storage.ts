type GameHistory = {
    played: number,
    wins: number,
    streak: number,
    bestStreak: number,
    distribution: number[],
    lastWin: number,
    lastPlay: number
}

class GameStorage {
    private static historyName: string = "history";
    private static guessName: string = "guessesList";

    public static storeHistory(history: GameHistory) {
        GameStorage.setPermanentCookie(GameStorage.historyName, JSON.stringify(history));
    }

    public static loadHistory(): GameHistory {
        const history = GameStorage.getCookie(GameStorage.historyName);
        if(history == undefined)
            return this.defaultHistory();
        const h: GameHistory = JSON.parse(history);
        const d1 = new Date();
        const d2 = new Date(h.lastWin);
        d2.setHours(48, 0, 0, 0);
        if(d2 < d1) {
            h.streak = 0;
        }
        return h;
    }

    public static defaultHistory(): GameHistory {
        return {
            played: 0,
            wins: 0,
            streak: 0,
            bestStreak: 0,
            distribution: [0, 0, 0, 0, 0, 0, 0],
            lastWin: 0,
            lastPlay: 0,
        };
    }

    public static storeGuessHistory(guessHistory: string[]) {
        GameStorage.setCookie(GameStorage.guessName, JSON.stringify(guessHistory));
    }

    public static loadGuessHistory(): string[] {
        const history = GameStorage.getCookie(GameStorage.guessName);
        if(history == undefined)
            return [];
        return JSON.parse(history);
    }


    private static getCookie(name: string): string | undefined {
        name = name + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return undefined;
    };

    private static setPermanentCookie(name: string, value: string) {
        const d = new Date();
        d.setFullYear(2100, 1, 1);
        let expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };

    private static setCookie(name: string, value: string) {
        const d = new Date();
        d.setHours(24, 0, 0, 0);
        let expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    };
}

export type { GameHistory };
export { GameStorage };
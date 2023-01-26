import { GameStorage } from "./storage";
import { WordList } from "./words";

class GameState {
    
    private solution: string;

    private guesses: string[];
    private remainingWords: string[];

    private undos: number;

    private dictionary: string[];

    private history: string[];
    
    public constructor() {
        const allWords = WordList.allWords;

        this.guesses = [];
        this.solution = WordList.getWordToday();
        this.dictionary = allWords;
        this.remainingWords = allWords.map((val) => val);
        this.undos = 5;
        this.history = [];
    }

    public check(word: string): number {
        if (!this.dictionary.includes(word))
        return -1;
        if (!this.remainingWords.includes(word))
            return -2;
        return 0;
    }

    public getSolution(): string {
        return this.solution;
    }

    public addWord(word: string, toHistory: boolean = true) { //TODO this logic is not correct/enough
        if(toHistory)
            this.updateHistory(word);
        this.guesses.push(word);
        const test = this.testWord(word);
        const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const minCount: {[key: string]: number} = {};
        const maxCount: {[key: string]: number} = {};
        allLetters.split("").forEach((letter) => {
            minCount[letter] = 0;
            maxCount[letter] = 0;
        });
        for(let i = 0; i < 5; i++) {
            if(test[i] != 0) {
                minCount[word[i]] += 1;
                maxCount[word[i]] += 1;
            }
            if(test[i] == 0) {
                maxCount[word[i]] += 10;
            }
        }
        for(const key of Object.keys(maxCount)) {
            if(maxCount[key] >= 10) {
                maxCount[key] %= 10;
            } else {
                delete maxCount[key];
            }
        }

        const count = (word: string, letter: string) => {
            let cnt = 0;
            for(let i = 0; i < word.length; i++) {
                if(word[i] == letter)
                    cnt += 1;
            }
            return cnt;
        }

        const newRemaining: string[] = [];
        for(const remaining of this.remainingWords) {
            let ok = true;
            for(let i = 0; i < 5; i++) {
                if(test[i] == 2 && remaining[i] != word[i]) {
                    ok = false;
                    break;
                }
                if(remaining[i] == word[i] && test[i] != 2) {
                    ok = false;
                    break;
                }
            }
            for(const key of Object.keys(minCount)) {
                if(count(remaining, key) < minCount[key]) {
                    ok = false;
                    break;
                }
            }
            for(const key of Object.keys(maxCount)) {
                if(count(remaining, key) > maxCount[key]) {
                    ok = false;
                    break;
                }
            }
            if(ok)
                newRemaining.push(remaining);
        }
        this.remainingWords = newRemaining;
    }

    public getWordCount(): number {
        return this.remainingWords.length;
    }

    public getUndoCount(): number {
        return this.undos;
    }

    public testWord(word: string): number[] {
        return this._testWord(word, this.solution);
    }

    private _testWord(word: string, solution: string): number[] {
        const result = [];
        const lastIndices: {[key: string]: number} = {};
        for(let i = 0; i < word.length; i++) {
            if(!solution.includes(word[i])) {
                result.push(0);
                continue;
            }
            if(solution[i] == word[i]) {
                result.push(2);
                continue;
            }
            
            let lastIndex = word[i] in lastIndices ? lastIndices[word[i]] + 1 : 0;
            let pos = -1;
            while(true) {
                pos = solution.indexOf(word[i], lastIndex);
                if(pos < 0 || word[pos] != solution[pos]) {
                    break;
                }
                lastIndex = pos + 1;

            }
            if(pos >= 0) {
                lastIndices[word[i]] = pos;
                result.push(1);
            } else {
                result.push(0);
            }
        }
        return result;
    }

    private updateHistory(word: string) {
        this.history.push(word);
        GameStorage.storeGuessHistory(this.history);
    }

    public updateFromHistory(history: string[]) {
        this.guesses = [];
        this.history = [];
        this.undos = 5;
        this.remainingWords = this.dictionary.map((val) => val);

        for(const guess of history) {
            if(guess == "UNDO") {
                this.undo();
            } else {
                this.addWord(guess);
            }
        }
    }

    public undo() {
        if(this.undos == 0)
            return;
        this.updateHistory("UNDO");
        this.undos -= 1;
        const saveGuesses = this.guesses.map((val) => val);
        this.guesses.length = 0;
        this.remainingWords = this.dictionary.map((val) => val);
        for(let i = 0; i < saveGuesses.length - 1; i++)
            this.addWord(saveGuesses[i], false);
    }

    public getResultMatrix(): number[][] {
        const result = this.guesses.map((guess) => this.testWord(guess));
        for(let i = result.length; i < 6; i++) {
            result.push([-1, -1, -1, -1, -1]);
        }
        return result;
    }

    public getKeyDictionary(): {[key: string]: number} {
        const dict: {[key: string]: number}  = {};
        dict["_"] = -1;
        const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        allLetters.split("").forEach((letter) => dict[letter] = -1);
        for(const guess of this.guesses) {
            const test = this.testWord(guess);
            for(let i = 0; i < test.length; i++) {
                if(test[i] == 2) {
                    dict[guess[i]] = 2;
                }
                else if(test[i] >= 0) {
                    dict[guess[i]] = Math.max(test[i], dict[guess[i]]);
                }
            }
        }
        return dict;
    }

    public checkOver(): number {
        if(this.guesses.includes(this.solution)) {
            return 2; //you accidentally wordled
        }
        if(this.guesses.length == 6) {
            return 1; //you won
        }
        if(this.remainingWords.length + this.guesses.length < 7 && this.undos == 0) {
            return 3; //not enough words to win
        }
        return 0; //not over
    }

    public getGuesses(): string[] {
        return this.guesses;
    }

    public getUndone(): string[] {
        const result: string[] = [];
        const stack: string[] = [];
        for(let i = 0; i < this.history.length; i++) {
            if(this.history[i] != "UNDO") {
                stack.push(this.history[i]);
            } else {
                result.push(stack.pop()!);
            }
        }
        return result;
    }

    public getUndoneResults(): number[][] {
        const result: number[][] = [];
        const words = this.getUndone();
        for(const word of words) {
            result.push(this.testWord(word));
        }
        return result;
    }
}

export { GameState };
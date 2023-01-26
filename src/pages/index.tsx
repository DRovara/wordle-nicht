import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Summary from './summary'
import TitleBar from './titleBar'
import { useEffect, useRef, useState } from 'react'
import Help from './help'
import Keyboard from './keyboard'
import Game from './game'
import { GameState } from '@/model/gameState'
import Toast from './toast'
import { GameHistory, GameStorage } from '@/model/storage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

    const [gameState, setGameState] = useState(new GameState());

    const _history: GameHistory = GameStorage.defaultHistory();
    const [history, setHistory] = useState(_history);
    useEffect(() => {
        const guessHistory = GameStorage.loadGuessHistory();
        gameState.updateFromHistory(guessHistory);
        setGameOver(gameState.checkOver());
        const guesses = gameState.getGuesses();
        for(let i = 0; i < guesses.length; i++) {
            for(let j = 0; j < guesses[i].length; j++) {
                gameData[i][j] = guesses[i][j];
            }
        }
        setCurrentRow(guesses.length);
        if(gameState.checkOver())
            showSummary();
        setHistory(GameStorage.loadHistory());

        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        window.addEventListener('resize', () => {
            // We execute the same script as before
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }, []);

    const toast = useRef<Toast>(null);


    const [gameOver, setGameOver] = useState(0);
    const [summaryVisible, setSummaryVisible] = useState(false);
    const showSummary = () => { hideHelp(); setSummaryVisible(true); }
    const hideSummary = () => setSummaryVisible(false);

    const [helpVisible, setHelpVisible] = useState(false);
    const showHelp = () => { hideSummary(); setHelpVisible(true); }
    const hideHelp = () => setHelpVisible(false);

    const [shake, setShake] = useState(false);

    const send = () => {
        if(currentRow >= 6 || gameOver != 0)
            return;
        const word = gameData[currentRow].reduce((x, y) => x + y, "");
        if(word.length != 5)
            return;
        const ok = gameState.check(word);
        if(ok == -1) {
            toast.current?.show("Wort nicht gefunden!", 2000);
            setShake(true);
            setTimeout(() => setShake(false), 1000);
            return;
        }
        if(ok == -2) {
            setShake(true);
            toast.current?.show("Bitte verwende alle bestätigten Buchstaben!", 2000);
            setTimeout(() => setShake(false), 1000);
            return;
        }
        gameState.addWord(word);
        setCurrentRow(currentRow + 1);
        setCurrentColumn(0);

        setTimeout(() => {
            const over = gameState.checkOver();
            setGameOver(over);
            if(over != 0) {
                const d1 = new Date();
                const d2 = new Date(history.lastPlay);
                d2.setHours(24, 0, 0, 0);
                if(d2 < d1) {
                    history.played += 1;
                    history.lastPlay = new Date().getTime();
                    if(over == 1) {
                        history.wins += 1;
                        history.streak += 1;
                        if(history.streak > history.bestStreak)
                            history.bestStreak = history.streak;
                        history.distribution[5 - gameState.getUndoCount()] += 1;
                        history.lastWin = new Date().getTime();
                    } else {
                        history.distribution[6] += 1;
                    }
                    GameStorage.storeHistory(history);
                }
                showSummary();
            }
        }, 1000);
        
    }

    const keyClick = (key: string) => {
        if(key.length == 1) {
            gameData[currentRow][currentColumn] = key;
            setGameData(gameData.map((val) => val));
            setCurrentColumn(currentColumn < 4 ? currentColumn + 1 : currentColumn);
        } else if(key == "ENTER") {
            send();
        } else if(key == "BACKSPACE" && currentColumn >= 0) {
            if(gameData[currentRow][currentColumn] == "" && currentColumn > 0) {
                gameData[currentRow][currentColumn - 1] = "";
                setCurrentColumn(currentColumn - 1);
                setGameData(gameData.map((val) => val));
            } else {
                gameData[currentRow][currentColumn] = "";
                setGameData(gameData.map((val) => val));
            }
        }
    }

    function keyboardDown(event: KeyboardEvent) {
        if((event.key != "Backspace") && (event.key != "Enter") && ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(event.key.toUpperCase()) == -1))
            return;
        keyClick(event.key.toUpperCase());
    }

    const [gameData, setGameData] = useState([["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]])
    const [currentRow, setCurrentRow] = useState(0)
    const [currentColumn, setCurrentColumn] = useState(0);
    const [dummy, setDummy] = useState(0);

    const boardClick = (row: number, column: number) => {
        if(row == currentRow) {
            setCurrentColumn(column);
        }
    }

    const undoButtonRef = useRef<HTMLButtonElement>(null);
    const undo = () => {
        if(currentRow == 0)
            return;
        if(gameState.checkOver() != 0)
            return;
        gameData[currentRow] = ["", "", "", "", ""];
        gameState.undo();
        gameData[currentRow - 1] = ["", "", "", "", ""];
        setCurrentRow(currentRow => currentRow - 1);
        setCurrentColumn(0);
        setDummy(dummy + 1);
        undoButtonRef.current?.blur();
    }

    useEffect(() => {
        document.addEventListener("keydown", keyboardDown);

        return () => document.removeEventListener("keydown", keyboardDown);
    });


    return (
        <>
            <Head>
                <title>Wordle nicht!</title>
                <meta name="description" content="Schaffst du es, nicht zu wordlen?" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.png" />
            </Head>
            <TitleBar statsClick={showSummary} helpClick={showHelp}></TitleBar>
            <Summary gameState={gameState} undos={5 - gameState.getUndoCount()} overType={gameOver} visible={summaryVisible} closeCick={hideSummary} played={history.played} wins={history.wins} streak={history.streak} bestStreak={history.bestStreak} distribution={history.distribution}></Summary>
            <Help visible={helpVisible} closeCick={hideHelp}></Help>
            <Toast ref={toast}></Toast>
            <main className={styles.main}>
                <div className={styles.gameView}>
                    <div className={styles.info}>
                        <div className={styles.infoEntry}><h1>{gameState.getWordCount()}</h1><span>Wörter übrig</span></div>
                        <div className={styles.infoEntry}><h1>{gameState.getUndoCount()}</h1><span>UPS! übrig</span></div>
                    </div>
                    <Game shake={shake} results={gameState.getResultMatrix()} data={gameData} activeRow={currentRow} activeColumn={currentColumn} boardClicked={boardClick}></Game>
                    
                    <div className={styles.undoRow}>
                        <button className={styles.undoButton} ref={undoButtonRef} onClick={undo}>UPS!</button>
                    </div>
                </div>
                
                <Keyboard keyColours={gameState.getKeyDictionary()} onKeyDown={keyClick}></Keyboard>
            </main>
        </>
    )
}

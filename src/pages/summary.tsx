import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Summary.module.css'
import React, { useEffect, useState } from 'react'
import { GameState } from '@/model/gameState'

const inter = Inter({ subsets: ['latin'] })

type SummaryProps = {
    played: number,
    wins: number,
    streak: number,
    bestStreak: number,
    distribution: number[],

    visible: boolean,
    closeCick: () => void,

    overType: number,
    undos: number,
    gameState: GameState,

    showMessage: (message: string) => void,
}

function visualise(gameState: GameState): string {
    const matrix = gameState.getResultMatrix();
    let result = "";
    for(let row = 0; row < matrix.length; row++) {
        if(matrix[row][0] < 0)
            break;
        for(let column = 0; column < matrix[row].length; column++) {
            result += matrix[row][column] == 0 ? ("⬛") : (matrix[row][column] == 1 ? ("🟧") : (matrix[row][column] == 2 ? "🟩" : ""));
        }
        result += "\n";
    }
    result += 'Verwendete "UPS!": ' + (5 - gameState.getUndoCount()) + "\n";
    return result;
}

function copyResult(gameState: GameState, overType: number): void {
    let text = "";
    if(overType == 1) {
        text = "Hurra! Ich habe heute nicht gewordlet!\n\n";
    } else if(overType >= 2) {
        text = "Oh nein... Ich habe gewordlet!\n\n";
    }
    text += visualise(gameState) + "\n";
    text += "Versuch's auch: drovara.github.io/wordle-nicht";

    const copyToClipboard = (str: string) => {
        var el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        var selected =            
            document.getSelection()!.rangeCount > 0        
            ? document.getSelection()!.getRangeAt(0)     
            : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {                                 
            document.getSelection()!.removeAllRanges();
            document.getSelection()!.addRange(selected);
        }
    };
    copyToClipboard(text);
}

export default function Summary(props: SummaryProps) { //TODO title
    const [copied, setCopied] = useState(false);
    const [untilNext, setUntilNext] = useState(0);
    
    useEffect(() => {
        const d1 = new Date();
        const d2 = new Date();
        d2.setHours(24, 0, 0, 0);
        const diff = Math.floor((d2.getTime() - d1.getTime()) / 1000);
        setUntilNext(diff);

        setTimeout(() => {
            if(!props.visible)
                return;
            const d1 = new Date();
            const d2 = new Date();
            d2.setHours(24, 0, 0, 0);
            const diff = Math.floor((d2.getTime() - d1.getTime()) / 1000);
            setUntilNext(diff);
        }, 1000);
    });

    if(props.distribution == undefined)
        return (<div></div>);
    let statSum = props.distribution != undefined ? props.distribution.reduce((prev, curr) => prev + curr) : 0;
    if(statSum == 0)
        statSum = 1;
    const distSizes = props.distribution != undefined ? props.distribution.map((val) => Math.floor(val / statSum * 100) + "%") : ["0%", "0%", "0%", "0%", "0%", "0%", "0%"];

    const messages = ["Die Runde läuft noch!", "Hurra! Du hast nicht gewordlet! Die Lösung war " + props.gameState?.getSolution() + ".", "Oh nein... Du hast gewordlet!", "Es sind zu wenige Wörter übrig... Die Lösung war " + props.gameState?.getSolution() + "."];

    const hide = () => {
        props.closeCick();
    }

    const copy = () => {
        if(props.overType == 0) {
            props.showMessage("Beende die Runde, bevor du deine Ergebnisse teilst!")
            return;
        }
        copyResult(props.gameState, props.overType);
        setCopied(true);
    }

    return (
        <>
            <div className={props.visible ? styles.boxVisible : styles.boxHidden}>
                <button className={styles.closeButton} onClick={hide}><img src="close.png" /></button>
                <div className={styles.summaryItem}>
                    <h2>{messages[props.overType]}</h2>
                </div>

                <div className={styles.separator}></div>

                <div className={styles.summaryItem}>
                    <h1>STATISTIK</h1>
                    <div className={styles.statisticsBox}>
                        <div className={styles.statisticsBoxEntry}><h2>{props.played}</h2><div>gespielt</div></div>
                        <div className={styles.statisticsBoxEntry}><h2>{props.played == 0 ? "0" : Math.floor(props.wins / props.played * 100)}</h2><div>Sieg %</div></div>
                        <div className={styles.statisticsBoxEntry}><h2>{props.streak}</h2><div>Streak</div></div>
                        <div className={styles.statisticsBoxEntry}><h2>{props.bestStreak}</h2><div>Bester Streak</div></div>
                    </div>
                </div>

                <div className={styles.separator}></div>

                <div className={styles.summaryItem}>
                    <h1>UPS-VERTEILUNG</h1>
                    <div className={styles.distributionBox}>
                        <div className={styles.distributionBoxEntry}><h3>0</h3><div className={styles.distributionBoxBarEntry}><div style={{"width": distSizes[0], "visibility": distSizes[0] != "0%" ? "visible" : "hidden"}}className={(props.overType == 1 && props.undos == 0) ? styles.barActive : styles.barInactive}><div className={styles.barText}>{props.distribution[0]}</div></div></div></div>
                        <div className={styles.distributionBoxEntry}><h3>1</h3><div className={styles.distributionBoxBarEntry}><div style={{"width": distSizes[1], "visibility": distSizes[1] != "0%" ? "visible" : "hidden"}}className={(props.overType == 1 && props.undos == 1) ? styles.barActive : styles.barInactive}><div className={styles.barText}>{props.distribution[1]}</div></div></div></div>
                        <div className={styles.distributionBoxEntry}><h3>2</h3><div className={styles.distributionBoxBarEntry}><div style={{"width": distSizes[2], "visibility": distSizes[2] != "0%" ? "visible" : "hidden"}}className={(props.overType == 1 && props.undos == 2) ? styles.barActive : styles.barInactive}><div className={styles.barText}>{props.distribution[2]}</div></div></div></div>
                        <div className={styles.distributionBoxEntry}><h3>3</h3><div className={styles.distributionBoxBarEntry}><div style={{"width": distSizes[3], "visibility": distSizes[3] != "0%" ? "visible" : "hidden"}}className={(props.overType == 1 && props.undos == 3) ? styles.barActive : styles.barInactive}><div className={styles.barText}>{props.distribution[3]}</div></div></div></div>
                        <div className={styles.distributionBoxEntry}><h3>4</h3><div className={styles.distributionBoxBarEntry}><div style={{"width": distSizes[4], "visibility": distSizes[4] != "0%" ? "visible" : "hidden"}}className={(props.overType == 1 && props.undos == 4) ? styles.barActive : styles.barInactive}><div className={styles.barText}>{props.distribution[4]}</div></div></div></div>
                        <div className={styles.distributionBoxEntry}><h3>5</h3><div className={styles.distributionBoxBarEntry}><div style={{"width": distSizes[5], "visibility": distSizes[5] != "0%" ? "visible" : "hidden"}}className={(props.overType == 1 && props.undos == 5) ? styles.barActive : styles.barInactive}><div className={styles.barText}>{props.distribution[5]}</div></div></div></div>
                        <div className={styles.distributionBoxEntry}><h3>X</h3><div className={styles.distributionBoxBarEntry}><div style={{"width": distSizes[6], "visibility": distSizes[6] != "0%" ? "visible" : "hidden"}}className={(props.overType > 1)                      ? styles.barActive : styles.barInactive}><div className={styles.barText}>{props.distribution[6]}</div></div></div></div>
                    </div>
                </div>

                <div className={styles.separator}></div>

                <div className={styles.summaryItem}>
                    <h4>NÄCHSTES WORDLE-NICHT! IN:</h4>
                    <h1>{("0" + Math.floor(untilNext / 3600)).slice(-2)}:{("0" + Math.floor(untilNext / 60) % 60).slice(-2)}:{("0" + untilNext%60).slice(-2)}</h1>
                </div>

                <div className={styles.separator}></div>

                <button className={styles.shareButton} onClick={copy}>{copied ? "KOPIERT!" : "TEILEN"}</button>
            </div>
        </>
    )
}

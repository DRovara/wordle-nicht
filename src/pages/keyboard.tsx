import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Keyboard.module.css'
import React, { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type KeyboardProps = {
    onKeyDown: (key: string) => void,
    keyColours: {[key: string]: number}
};

export default function Keyboard(props: KeyboardProps) {
    const colourToStyle = (key: string) => {
        if(props.keyColours == undefined)
            return styles.keyWhite + " ";
        const colour = props.keyColours[key];
        if(colour == -1)
            return styles.keyWhite + " ";
        if(colour == 0)
            return styles.keyGrey + " ";
        if(colour == 1)
            return styles.keyAmber + " ";
        if(colour == 2)
            return styles.keyGreen + " ";
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.keyboardRow}>
                    <button onClick={() => props.onKeyDown("Q")} className={colourToStyle("Q") + styles.keyboardKey}>Q</button>
                    <button onClick={() => props.onKeyDown("W")} className={colourToStyle("W") + styles.keyboardKey}>W</button>
                    <button onClick={() => props.onKeyDown("E")} className={colourToStyle("E") + styles.keyboardKey}>E</button>
                    <button onClick={() => props.onKeyDown("R")} className={colourToStyle("R") + styles.keyboardKey}>R</button>
                    <button onClick={() => props.onKeyDown("T")} className={colourToStyle("T") + styles.keyboardKey}>T</button>
                    <button onClick={() => props.onKeyDown("Z")} className={colourToStyle("Z") + styles.keyboardKey}>Z</button>
                    <button onClick={() => props.onKeyDown("U")} className={colourToStyle("U") + styles.keyboardKey}>U</button>
                    <button onClick={() => props.onKeyDown("I")} className={colourToStyle("I") + styles.keyboardKey}>I</button>
                    <button onClick={() => props.onKeyDown("O")} className={colourToStyle("O") + styles.keyboardKey}>O</button>
                    <button onClick={() => props.onKeyDown("P")} className={colourToStyle("P") + styles.keyboardKeyLast}>P</button>
                </div>
                <div className={styles.keyboardRow}>
                    <button onClick={() => props.onKeyDown("A")} className={colourToStyle("A") + styles.keyboardKey}>A</button>
                    <button onClick={() => props.onKeyDown("S")} className={colourToStyle("S") + styles.keyboardKey}>S</button>
                    <button onClick={() => props.onKeyDown("D")} className={colourToStyle("D") + styles.keyboardKey}>D</button>
                    <button onClick={() => props.onKeyDown("F")} className={colourToStyle("F") + styles.keyboardKey}>F</button>
                    <button onClick={() => props.onKeyDown("G")} className={colourToStyle("G") + styles.keyboardKey}>G</button>
                    <button onClick={() => props.onKeyDown("H")} className={colourToStyle("H") + styles.keyboardKey}>H</button>
                    <button onClick={() => props.onKeyDown("J")} className={colourToStyle("J") + styles.keyboardKey}>J</button>
                    <button onClick={() => props.onKeyDown("K")} className={colourToStyle("K") + styles.keyboardKey}>K</button>
                    <button onClick={() => props.onKeyDown("L")} className={colourToStyle("L") + styles.keyboardKeyLast}>L</button>
                </div>
                <div className={styles.keyboardRow}>
                    <button onClick={() => props.onKeyDown("ENTER")} className={styles.keyWhite + " " + styles.keyboardKey}><img className={styles.enterKey} src="enter.png" /></button>
                    <button onClick={() => props.onKeyDown("Y")} className={colourToStyle("Y") + styles.keyboardKey}>Y</button>
                    <button onClick={() => props.onKeyDown("X")} className={colourToStyle("X") + styles.keyboardKey}>X</button>
                    <button onClick={() => props.onKeyDown("C")} className={colourToStyle("C") + styles.keyboardKey}>C</button>
                    <button onClick={() => props.onKeyDown("V")} className={colourToStyle("V") + styles.keyboardKey}>V</button>
                    <button onClick={() => props.onKeyDown("B")} className={colourToStyle("B") + styles.keyboardKey}>B</button>
                    <button onClick={() => props.onKeyDown("N")} className={colourToStyle("N") + styles.keyboardKey}>N</button>
                    <button onClick={() => props.onKeyDown("M")} className={colourToStyle("M") + styles.keyboardKey}>M</button>
                    <button onClick={() => props.onKeyDown("BACKSPACE")} className={styles.keyWhite + " " + styles.keyboardKeyLast}><img className={styles.backspaceKey} src="backspace.png" /></button>
                </div>
            </div>
        </>
    )
}

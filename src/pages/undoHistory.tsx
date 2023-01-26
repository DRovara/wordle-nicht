import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/UndoHistory.module.css'
import React, { Component, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type UndoHistoryProps = {
    visible: boolean,
    words: string[],
    results: number[][],
    closeFunction: () => void,
};

export default function UndoHistory(props: UndoHistoryProps) {
    if(props.words == undefined)
        return (<div></div>)
    return (
        <div className={props.visible ? styles.visible : styles.hidden}>
            {
                new Array(props.words.length).fill(0).map((_, row) => (
                    <div className={styles.boardRow} key={"r-" + row}>
                    {
                        new Array(5).fill(0).map((_, column) => (
                            <div className={(props.results[row][column] == -1 ? "" : (props.results[row][column] == 0 ? styles.cellGrey : (props.results[row][column] == 1 ? styles.cellAmber : styles.cellGreen))) + " " + (column != 4 ? styles.boardCell : styles.boardCellLast)} key={"c-" + row + "-" + column}>
                                <div className={styles.contents} key={"ct-" + row + "-" + column}>{props.words[row][column].toUpperCase()}</div>
                            </div>
                        ))
                    }
                    </div>
                ))
            }
            {
                new Array(5 - props.words.length).fill(0).map((_, row) => (
                    <div className={styles.boardRow + " " + styles.invisibleRow} key={"r2-" + row}>
                    {
                        new Array(5).fill(0).map((_, column) => (
                            <div className={styles.cellGrey + " " + (column != 4 ? styles.boardCell : styles.boardCellLast)} key={"c2-" + row + "-" + column}>
                                <div className={styles.contents} key={"ct2-" + row + "-" + column}>{"X"}</div>
                            </div>
                        ))
                    }
                    </div>
                ))
            }
            <button className={styles.okButton} onClick={props.closeFunction}>OK!</button>
        </div>
    );
}
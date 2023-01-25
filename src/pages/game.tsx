import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Game.module.css'
import React, { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type GameProps = {
    data: string[][],
    activeRow: number,
    activeColumn: number,
    boardClicked: (row: number, column: number) => void,
    results: number[][],
    shake: boolean,
};

export default function Game(props: GameProps) {
    if(props.data == undefined)
        return (<div></div>);
    return (
        <> 
            <div className={styles.container}>
            {
                new Array(6).fill(0).map((_, row) => (
                    <div className={(props.activeRow == row && props.shake) ? styles.boardRowShakey : styles.boardRow} key={"r-" + row}>
                    {
                        new Array(5).fill(0).map((_, column) => (
                            <div className={(props.results[row][column] == -1 ? "" : (props.results[row][column] == 0 ? styles.cellGrey : (props.results[row][column] == 1 ? styles.cellAmber : styles.cellGreen))) + " " + (column != 4 ? styles.boardCell : styles.boardCellLast) + (props.activeRow == row && props.activeColumn == column ? " " + styles.boardCellSelected : "")} key={"c-" + row + "-" + column} onClick={() => props.boardClicked(row, column)}>
                                <div className={styles.contents + " " + (props.results[row][column] == -1 ? "" : styles.contentsEntered)} key={"ct-" + row + "-" + column}>{props.data[row][column].toUpperCase()}</div>
                            </div>
                        ))
                    }
                    </div>
                ))
            }
            </div>
        </>
    )
}

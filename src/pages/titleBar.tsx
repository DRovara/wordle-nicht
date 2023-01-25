import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/TitleBar.module.css'
import React, { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type TitleBarProps = {
    helpClick: () => void,
    statsClick: () => void,
}

export default function TitleBar(props: TitleBarProps) {
    return (
        <>
            <div className={styles.titleBar}>
                <button className={styles.helpButton} onClick={props.helpClick}><img src="help.png" /></button>
                <button className={styles.statsButton} onClick={props.statsClick}><img src="stats2.png" /></button>
                <div className={styles.title}><h1>Wordle nicht!</h1></div>
            </div>
        </>
    )
}

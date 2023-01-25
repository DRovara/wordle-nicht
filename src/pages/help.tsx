import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Help.module.css'
import React, { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type HelpProps = {
    visible: boolean,
    closeCick: () => void,
}

export default function Help(props: HelpProps) {
    const hide = () => {
        props.closeCick();
    }

    return (
        <>
            <div className={props.visible ? styles.boxVisible : styles.boxHidden}>
                <button className={styles.closeButton} onClick={hide}><img src="close.png" /></button>
                <div className={styles.summaryItem}>
                    <h1>Wordle Regeln</h1>
                    <div>Wordle ist ein Wortratespiel, bei dem jeden Tag ein neues Lösungswort bestimmt wird. Der Spieler muss dann innerhalb von 6 versuchen, das Wort zu erraten. 
                        Nachdem ein Wort eingegeben wurde, wird für jeden Buchstaben ein hinweis angezeigt.<br></br>
                        <b>GRÜN:</b> Der Buchstabe kommt im Lösungswort an genau dieser Stelle vor.<br></br>
                        <b>GELB:</b> Der Buchstabe kommt im Läsungswort an einer anderen Stelle vor.<br></br>
                        <b>GRAU:</b> Der Buchstabe kommt im Lösungswort nicht mehr vor.<br></br>
                    </div>
                </div>

                <div className={styles.separator}></div>

                <div className={styles.summaryItem}>
                    <h1>Wordle NICHT</h1>
                    <div>
                        Das Ziel von <em>Wordle nicht!</em> ist es, Wordle zu spielen und dabei zu verlieren! Versuche 6 Wörter einzugeben, ohne dabei die Lösung zu finden.
                        Aber Vorsicht: Nachdem du ein Wort eingegeben hast, müssen immer alle Hinweise davon angewendet werden! Ist ein Buchstabe zum Beispiel nach dem ersten
                        Versuch grün, muss er in allen weiteren Wörtern verwendet werden!<br></br>
                        Damit es nicht zu schwierig wird, darf fünfmal &quot;UPS!&quot; verwendet werden. Dadurch kann das letzte eingegebene Wort wieder entfernt werden.
                    </div>
                </div>

                <div className={styles.separator}></div>

                <div className={styles.summaryItem}>
                    <div><h4>Mehr?</h4> Komm zur github Seite: <a href="http://www.github.com/DRovara/wordle-nicht">github.com/DRovara/wordle-nicht</a></div>
                </div>
            </div>
        </>
    )
}

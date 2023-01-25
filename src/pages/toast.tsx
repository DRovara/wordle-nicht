import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Toast.module.css'
import React, { Component, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

type ToastProps = {
};

type ToastState = {
    visible: boolean,
    text: string,
};

class Toast extends Component<ToastProps, ToastState> {

    state: ToastState = {
        visible: false,
        text: "!",
    }

    render() {
        return (
            <div className={this.state.visible ? styles.toastVisible : styles.toastHidden}>
                {this.state.text}
            </div>
        )
    }

    public show(text: string, duration: number) {
        this.setState((_) => ({
            visible: true,
            text: text,
        }));

        setTimeout(() => this.hide(), duration);
    }

    public hide() {
        this.setState((state) => ({
            visible: false,
            text: state.text,
        }));
    }
}

export default Toast
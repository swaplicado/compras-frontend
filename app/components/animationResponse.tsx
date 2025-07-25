import React from "react";
import { Button } from 'primereact/button';
import Lottie from 'lottie-react';
import successAnimation from '@/public/layout/animations/Animation - success.json';
import errorAnimation from '@/public/layout/animations/Animation - error.json';

interface Props {
    show: boolean;
    title: string;
    text: string;
    buttonLabel: string;
    action: () => void;
    classCard?: boolean | true;
}
export const animationLoading = ({ show, title, text, buttonLabel, action, classCard }: Props) => {
    if (!show) {
        return null;
    }
    return (
        <div className="col-12 text-center">
            <div className={`p-fluid ${classCard ? 'card' : ''}`} style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ width: 200, height: 200, margin: '0 auto' }}>
                    <Lottie animationData={successAnimation} loop={true} autoplay={true} />
                </div>
                <>
                    <h3 className="mt-3">{title}</h3>
                    <p className="mt-2">{text}</p>
                    <Button label={buttonLabel} className="mt-4" onClick={action} />
                </>
            </div>
        </div>
    );
}

export const animationSuccess = ( { show, title, text, buttonLabel, action, classCard }: Props ) => {
    if (!show) {
        return null;
    }
    return (
        <div className="col-12 text-center">
            <div className={`p-fluid ${classCard ? 'card' : ''}`} style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ width: 200, height: 200, margin: '0 auto' }}>
                    <Lottie animationData={successAnimation} loop={false} autoplay={true} />
                </div>
                <>
                    <h3 className="mt-3">{title}</h3>
                    <p className="mt-2">{text}</p>
                    <Button label={buttonLabel} className="mt-4" onClick={action} />
                </>
            </div>
        </div>
    );
};

export const animationError = ( { show, title, text, buttonLabel, action, classCard }: Props ) => {
    if (!show) {
        return null;
    }
    return (
        <div className="col-12 text-center">
            <div className={`p-fluid ${classCard ? 'card' : ''}`} style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ width: 200, height: 200, margin: '0 auto' }}>
                    <Lottie animationData={errorAnimation} loop={false} autoplay={true} />
                </div>
                <>
                    <h3 className="mt-3">{title}</h3>
                    <p className="mt-2">{text}</p>
                    <Button label={buttonLabel} className="mt-4" onClick={action} />
                </>
            </div>
        </div>
    );
}
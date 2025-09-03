import React, {useEffect, useState} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useIsMobile } from '@/app/components/commons/screenMobile';

interface DialogManualProps {
    visible: boolean;
    onHide: () => void;
    lVideos: any[];
    setShowManual: React.Dispatch<React.SetStateAction<boolean>>;
    helpText: any
}

export const DialogManual = ( { visible, onHide, lVideos, setShowManual, helpText }: DialogManualProps ) => {
    const [ videoUrl, setVideoUrl ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);
    const isMobile = useIsMobile();

    const showVideo = async (url: string) => {
        setLoading(true);
        setVideoUrl(url);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
    }

    useEffect(() => {
        setVideoUrl('');
    }, [visible])

    return (
        <>
            <Button 
                label={helpText.buttonLabel}
                icon="pi pi-question-circle" 
                className="p-button-text p-button-sm"
                data-pr-tooltip={helpText.buttonTooltip}
                onClick={() => setShowManual(!visible)}
            />
            <Dialog
                header={helpText.dialogHeader}
                visible={visible}
                onHide={onHide}
                style={{ width: isMobile ? '100%' : '50rem' }}
                pt={{ header: { className: 'pb-2 pt-2 border-bottom-1 surface-border' } }}
            >
                <div className="p-fluid formgrid grid">
                    <div className="col-12">
                        <div className="card">
                            <div className="p-fluid formgrid grid justify-content-center">
                                {lVideos.map((video: any, index: number) => (
                                    <div key={index} className="col-12 md:col-8 pt-2">
                                        <Button
                                            label={video.title}
                                            className="p-button-text p-button-sm login-help"
                                            data-pr-tooltip={helpText.buttonTooltip}
                                            onClick={() => showVideo(video.url)}
                                        />
                                    </div>
                                ))}
                                { loading && (
                                    <div className="flex col-12 md:col-12 pt-3 justify-content-center">
                                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />    
                                    </div>
                                )}
                                { videoUrl && !loading && (
                                    <div className="col-12 md:col-12 pt-3">
                                        <iframe
                                            width="100%"
                                            height={ isMobile ? '200' : '500' }
                                            src={videoUrl}
                                            title={''}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
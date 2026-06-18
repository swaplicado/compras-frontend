import React from "react";
import { Button } from "primereact/button";
import { DialogManual } from '@/app/components/videoManual/dialogManual';

interface renderInfoButtonProps {
    instructions: any;
    showInfo: boolean;
    setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
    showManual: boolean;
    setShowManual: React.Dispatch<React.SetStateAction<boolean>>;
    btnShowInstructionsText: string;
    btnHideInstructionsText: string;
    dialogManualBtnLabelText: string;
    dialogManualBtnTooltipText: string;
    dialogManualHeaderText: string;
    lVideos: any[];
}

export const RenderInfoButton = ({
    instructions,
    showInfo,
    setShowInfo,
    showManual,
    setShowManual,
    btnShowInstructionsText,
    btnHideInstructionsText,
    dialogManualBtnLabelText,
    dialogManualBtnTooltipText,
    dialogManualHeaderText,
    lVideos
}: renderInfoButtonProps) => {
    if (
        !instructions || 
        (Array.isArray(instructions) && typeof instructions[0] === 'string') // Para el ['dialog.viewInstructions'] que regresa la libreria
    ) {
        return null;
    }

    return (
        <div className="pb-4">
            <Button 
                label={!showInfo ? btnShowInstructionsText : btnHideInstructionsText} 
                icon="pi pi-info-circle" 
                className="p-button-text p-button-secondary p-0" 
                onClick={() => setShowInfo(!showInfo)} 
                severity="info" 
            />
            {showInfo && (
                <div className="p-3 border-1 border-round border-gray-200 bg-white mb-3 surface-border surface-card mt-2">
                    { lVideos && lVideos.length > 0 && (
                        <DialogManual 
                            visible={showManual} 
                            onHide={() => setShowManual(false)} 
                            lVideos={lVideos} 
                            setShowManual={setShowManual}
                            helpText={ {
                                buttonLabel: dialogManualBtnLabelText,
                                buttonTooltip: dialogManualBtnTooltipText,
                                dialogHeader: dialogManualHeaderText,
                            } }
                        />
                    )}
                    {Object.keys(instructions).map((key, index) => {
                        // Verificamos que el item sea realmente un objeto (por si vienen basuras de i18n)
                        if (typeof instructions[key] !== 'object') return null;

                        return (
                            <React.Fragment key={index}>
                                <div className="mb-2">
                                    <h6 className="font-semibold text-700">{instructions[key].header}</h6>
                                    <ul className="m-0 pl-3">
                                        {Object.keys(instructions[key])
                                            .filter((subKey) => subKey.startsWith('step'))
                                            .map((subKey, subIndex) => (
                                                <li key={subIndex} className="text-600 mb-1">{instructions[key][subKey]}</li>
                                            ))}
                                    </ul>
                                </div>
                                <div className="text-600 font-italic mt-2">
                                    {Object.keys(instructions[key])
                                        .filter((subKey) => subKey.startsWith('footer'))
                                        .map((subKey) => (
                                            instructions[key][subKey]
                                        ))}
                                </div>
                            </React.Fragment>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
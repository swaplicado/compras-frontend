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
    if (!instructions || Object.keys(instructions).length === 0) {
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
                <div className="p-3 border-1 border-round border-gray-200 bg-white mb-3 surface-border surface-card">
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
                    {Object.keys(instructions).map((key, index) => (
                        <div key={index}>
                            <h6>{instructions[key].header}</h6>
                            <ul>
                                {Object.keys(instructions[key])
                                    .filter((subKey) => subKey.startsWith('step'))
                                    .map((subKey, subIndex) => (
                                        <li key={subIndex}>{instructions[key][subKey]}</li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
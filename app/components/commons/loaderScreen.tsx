import React, { useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ProgressSpinner } from 'primereact/progressspinner';

const loaderScreen = () => {
    return (
        <div className='overlay-panel'>
            <ProgressSpinner />
        </div>
    );
};
export default loaderScreen;
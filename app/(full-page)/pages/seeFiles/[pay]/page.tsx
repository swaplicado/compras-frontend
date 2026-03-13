'use client'
import React, { useState, useEffect } from 'react';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { getlUrlFilesDps } from '@/app/(main)/utilities/documents/common/filesUtils';
import { useParams } from 'next/navigation';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import constants from '@/app/constants/constants';
import { getExtensionFileByName } from '@/app/(main)/utilities/files/fileValidator';


const ViewFiles = () => {
    const [lUrlFiles, setLFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { pay } = useParams();
    const { t } = useTranslation('invoices');

    useEffect(() => {

        const getFiles = async () => {
            try {

                setLoading(true);

                const route = constants.ROUTE_GET_LIST_FILES_PAYMENTS;

                const response = await axios.get(constants.API_AXIOS_GET, {
                    params: {
                        route: route,
                        payment_id: pay
                    }
                });

                if (response.status === 200) {

                    const data = response.data.data;
                    let files: any[] = [];

                    Object.keys(data.files || {}).forEach((key) => {
                        files.push({
                            url: data.files[key],
                            extension: getExtensionFileByName(key),
                            name: key
                        });
                    });

                    setLFiles(files);

                } else {
                    throw new Error(response.statusText);
                }

            } catch (error: any) {

                console.error('Error obteniendo archivos:', error);

            } finally {
                setLoading(false);
            }
        };

        getFiles();

    }, [pay]);

    const nextFile = () => {
        if (currentIndex < lUrlFiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevFile = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="flex flex-column align-items-center justify-content-center">

            {loading && loaderScreen()}

            <h4 className="pt-3">Archivos del pago</h4>

            {lUrlFiles.length > 0 && (
                <>
                    <div className="flex gap-3 mb-3">

                        <Button
                            icon="pi pi-arrow-left"
                            onClick={prevFile}
                            disabled={currentIndex === 0}
                        />

                        <Button
                            icon="pi pi-arrow-right"
                            onClick={nextFile}
                            disabled={currentIndex === lUrlFiles.length - 1}
                        />

                    </div>

                    <div className="field col-12 md:col-8">
                        <CustomFileViewer
                            lFiles={lUrlFiles}
                            startIndex={currentIndex}
                            xmlHeight="auto"
                            expanded={true}
                            withShowBtn={false}
                            pdfHeight="45rem"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewFiles;
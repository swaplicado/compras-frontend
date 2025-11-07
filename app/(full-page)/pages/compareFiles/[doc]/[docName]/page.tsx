'use client'
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import { CustomFileViewer } from '@/app/components/documents/invoice/fileViewer';
import { getlUrlFilesDps } from '@/app/(main)/utilities/documents/common/filesUtils';
import { useParams } from 'next/navigation';
import loaderScreen from '@/app/components/commons/loaderScreen';
import { Divider } from 'primereact/divider';

const CompareFiles = () => {
    const [lUrlFiles, setLFiles] = useState<any[]>([]);
    const { doc, docName } = useParams();
    const [loading, setLoading] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getlUrlFilesDps({
                setLFiles: setLFiles,
                document_id: doc
            });
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (lUrlFiles.length > 0) {
            const index = lUrlFiles.findIndex((file: any) => file.name.startsWith('ext_') )
            if (index !== -1) {
                setStartIndex(index);
            }
        }
    }, [lUrlFiles])

    return (
            <div className="flex flex-column align-items-center justify-content-center">
                {loading && loaderScreen()}
                <h4 className='pt-3'>Factura: {docName}</h4>
                <div className="field col-12 md:col-12">
                    <div className="formgrid grid">
                        <div className={`field col-12 md:col-6`}>
                            <div className="formgrid">
                                <div className="col">
                                    { lUrlFiles.length > 0 && (
                                        <CustomFileViewer lFiles={lUrlFiles} xmlHeight='auto' expanded={true} withShowBtn={false}/>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`field col-12 md:col-6`}>
                            <div className="formgrid">
                                <div className="col">
                                    { lUrlFiles.length > 0 && (
                                        <CustomFileViewer lFiles={lUrlFiles} xmlHeight='auto' expanded={true} withShowBtn={false} startIndex={startIndex}/>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default CompareFiles;
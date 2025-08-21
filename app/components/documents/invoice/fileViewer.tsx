import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import xmlFormatter from 'xml-formatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface fileViewerProps {
    lFiles: any[];
}

export const CustomFileViewer = ({ lFiles }: fileViewerProps) => {
    const [xmlContent, setXmlContent] = useState('');
    const [showFiles, setShowFiles] = useState(false);
    const [oFile, setOFile] = useState<any>({});
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const { t } = useTranslation('invoices');

    useEffect(() => {
        if (lFiles.length > 0) {
            setOFile(lFiles[0]);
        }
    }, [lFiles]);

    useEffect(() => {
        if (!oFile.url) return;
    
        if (oFile.extension === 'xml') {
            getXmlContent(oFile.url);
        } else {
            setLoading(true);
            loadFile(oFile.url);
        }
    }, [oFile]);
    
    const nextFile = () => {
        const nextIndex = (index + 1) % lFiles.length;
        setIndex(nextIndex);
        setOFile(lFiles[nextIndex]);
    };

    const prevFile = () => {
        const prevIndex = (index - 1 + lFiles.length) % lFiles.length;
        setIndex(prevIndex);
        setOFile(lFiles[prevIndex]);
    };

    const getXmlContent = async (url: string) => {
        try {
            setLoading(true);
            const response = await axios.get(url, {
                responseType: 'text'
            });
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            const data = response.data;
            setXmlContent(data);
        } catch (error) {
            console.error('Error loading XML:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFile = async (url: string) => {
        setLoading(true);
        setHasError(false);
        try {
            const response = await axios.get(url, {
                responseType: 'blob'
            });
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            const blob = response.data;
            const objectUrl = URL.createObjectURL(blob);
            setFileUrl(objectUrl);
        } catch (err) {
            console.error('Error cargando archivo:', err);
            setHasError(true);
            setFileUrl('');
        } finally {
            setLoading(false);
        }
    };

    const renderFile = () => {
        return (
            <div>
                <Divider />
                <div className='flex justify-content-between'>
                    <Button label="<" onClick={prevFile} className="mb-2" />
                    <Button label=">" onClick={nextFile} className="mb-2" />
                </div>

                {loading && (
                    <div className="flex justify-content-center align-items-center" style={{ height: '500px' }}>
                        <ProgressSpinner />
                    </div>
                )}

                {!loading && !hasError && oFile.extension !== 'xml' && fileUrl && (
                    <iframe
                        src={fileUrl}
                        style={{ height: '500px', border: 'none', width: '100%' }}
                        title="File Viewer"
                        className="w-full border-1 border-gray-200"
                        onLoad={() => setLoading(false)}
                    />
                )}

                {!loading && hasError && oFile.extension !== 'xml' && (
                    <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <h3>{t('fileViewer.noFile')}</h3>
                    </div>
                )}

                {!loading && oFile.extension === 'xml' && (
                    xmlContent != 'error' && xmlContent != '' ? (
                        <SyntaxHighlighter
                            language="xml"
                            style={atomDark}
                            wrapLines={true}
                            showLineNumbers={true}
                            customStyle={{
                                borderRadius: '8px',
                                fontSize: '14px',
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'anywhere',
                                height: '500px',
                                width: '100%'
                            }}
                            className="syntax-highlighter-code"
                        >
                            {xmlFormatter(xmlContent)}
                        </SyntaxHighlighter>
                    ) : (
                        <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <h3>{t('fileViewer.noFile')}</h3>
                        </div>
                    )
                )}
            </div>
        );
    };

    return (
        <>
            <div className="mt-3 flex gap-2">
                <Button label={ !showFiles ? t('fileViewer.btnShowFiles') : t('fileViewer.btnHideFiles')} onClick={() => setShowFiles(!showFiles)} className="mb-2" />
            </div>
            {showFiles && (
                <div className="field col-12">
                    <div className="formgrid grid">
                        <div className="col">
                            { lFiles.length > 0 ? (
                                renderFile()
                            ) : (
                                <h3>Sin archivos para mostrar</h3>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

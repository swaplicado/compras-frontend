import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import xmlFormatter from 'xml-formatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface FileInfo {
    url: string;
    name: string;
    extension: string;
    id?: string | number;
}

interface FileViewerProps {
    lFiles: FileInfo[];
    expanded?: boolean;
    withShowBtn?: boolean;
    xmlWidht?: string;
    xmlHeight?: string;
    pdfWidht?: string;
    pdfHeight?: string;
    withBtnCompare?: boolean;
    urlCompare?: string;
    startIndex?: number;
}

type FileExtension = 'xml' | 'xls' | 'xlsx' | 'pdf' | 'jpg' | 'jpeg' | 'png' | 'txt';

export const CustomFileViewer: React.FC<FileViewerProps> = ({ 
    lFiles,
    expanded = false,
    withShowBtn = true,
    xmlWidht = '100%',
    xmlHeight = '500px',
    pdfWidht = '100%',
    pdfHeight = '500px',
    withBtnCompare,
    urlCompare,
    startIndex = 0
}) => {
    const [currentFileIndex, setCurrentFileIndex] = useState( lFiles?.length > 1 ? startIndex : 0);
    const [fileContent, setFileContent] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [isLoading, setIsLoading] = useState(false);
    const [objectUrl, setObjectUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { t } = useTranslation('fileViewer');
    const previousObjectUrlRef = useRef<string>('');
    // const currentFile = useMemo(() => lFiles[currentFileIndex], [lFiles, currentFileIndex]);
    const [currentFile, setCurrentFile] = useState(lFiles[currentFileIndex]);
    const canRender = ['pdf', 'jpg', 'jpeg', 'png'];

    useEffect(() => {
        setCurrentFileIndex(startIndex)
    }, [startIndex])

    useEffect(() => {
        setCurrentFile(lFiles[currentFileIndex]);
    }, [currentFileIndex])

    useEffect(() => {
        setError('');
        setFileContent('');

        if (objectUrl) {
            previousObjectUrlRef.current = objectUrl;
            setObjectUrl('');
        }

        if (!currentFile?.url) return;

        if (currentFile.extension == 'xml') {
            if (currentFile.url != '#') {
                fetchXmlContent(currentFile.url);
            } else {
                return;
            }
        } else  if (canRender.includes(currentFile?.extension)){
            if (currentFile.url != '#') {
                loadFile(currentFile.url);
            } else {
                return;
            }
        }
    }, [currentFile]);

    const navigateFile = useCallback(
        (direction: 'next' | 'prev') => {
            setCurrentFileIndex((prevIndex) => {
                if (direction == 'next') {
                    return (prevIndex + 1) % lFiles.length;
                } else {
                    return (prevIndex - 1 + lFiles.length) % lFiles.length;
                }
            });
        },
        [lFiles.length]
    );

    const fetchXmlContent = async (url: string) => {
        try {
            setIsLoading(true);

            const response = await axios.get(url, {
                responseType: 'text',
            });

            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            setFileContent(response.data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled:', err.message);
            } else {
                console.error('Error loading XML:', err);
                setError(t('loadError', 'Error loading file'));
            }
        } finally {
            setIsLoading(false);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };

    const loadFile = async (url: string) => {
        try {
            setIsLoading(true);

            const response = await axios.get(url, {
                responseType: 'blob',
            });

            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const blob = response.data;
            const urlObject = URL.createObjectURL(blob);
            setObjectUrl(urlObject);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Request canceled:', err.message);
            } else {
                console.error('Error loading file:', err);
                setError(t('loadError', 'Error loading file'));
            }
        } finally {
            setIsLoading(false);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };

    const renderFileContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-content-center align-items-center" style={{ height: '500px' }}>
                    <ProgressSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <h3>{error}</h3>
                </div>
            );
        }

        if (!currentFile) {
            return (
                <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <h3>{t('noFiles')}</h3>
                </div>
            );
        }

        if (currentFile && !isLoading) {
            switch (currentFile.extension as FileExtension) {
                case 'xml':
                    return fileContent ? (
                        <SyntaxHighlighter
                            language="xml"
                            style={atomDark}
                            wrapLines
                            showLineNumbers
                            customStyle={{
                                borderRadius: '8px',
                                fontSize: '14px',
                                height: `${xmlHeight}`,
                                width: `${xmlWidht}`,
                                overflow: 'auto'
                            }}
                        >
                            {xmlFormatter(fileContent)}
                        </SyntaxHighlighter>
                    ) : (
                        <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <h3>{t('noFile')}</h3>
                        </div>
                    );
    
                case 'xls':
                case 'xlsx':
                    return (
                        <div className="flex justify-content-center align-items-center" style={{ height: '100px' }}>
                            <div className="flex flex-column gap-2 align-items-center">
                                <h3>{t('noPreview')}</h3>
                            </div>
                        </div>
                    );
    
                case 'jpeg':
                case 'jpg':
                case 'png':
                    return (
                        <div className="flex justify-content-center align-items-center" style={{ height: '500px' }}>
                            <img src={objectUrl} alt={currentFile?.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                    );
                default:
                    return objectUrl ? (
                        <iframe src={objectUrl} style={{ height: `${pdfHeight}`, border: 'none', width: `${pdfWidht}` }} title={`File Viewer: ${currentFile?.name}`} className="w-full border-1 border-gray-200" onLoad={() => setIsLoading(false)} />
                    ) : (
                        <div className="flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <h3>{t('noFile')}</h3>
                        </div>
                    );
            
            }
        }
    };

    if (lFiles.length === 0) {
        return (
            <div className="mt-3">
                <h3>{t('noFiles')}</h3>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <div className='flex justify-content-between'>
                { withShowBtn && (
                    <Button label={isExpanded ? t('btnHideFiles') : t('btnShowFiles')} onClick={() => setIsExpanded(!isExpanded)} className="mb-2" icon={isExpanded ? 'pi pi-eye-slash' : 'pi pi-eye'} />
                )}
                { withBtnCompare && (
                    <Button label={'Comparar archivos'} onClick={() => window.open(urlCompare)} className="mb-2" icon={'bx bx-border-all'} />
                )}
            </div>

            {isExpanded && (
                <div className="field col-12">
                    <Divider />
                    <div className="flex justify-content-between align-items-center mb-3">
                        <Button icon="pi pi-chevron-left" onClick={() => navigateFile('prev')} disabled={lFiles.length <= 1} className="p-button-text" />

                        <div className="text-center">
                            <h5 className="mb-1">{currentFile?.name}</h5>
                            <small className="text-color-secondary">{t('fileCounter', { current: currentFileIndex + 1, total: lFiles.length })}</small>
                        </div>

                        <Button icon="pi pi-chevron-right" onClick={() => navigateFile('next')} disabled={lFiles.length <= 1} className="p-button-text" />
                    </div>

                    {renderFileContent()}
                </div>
            )}
        </div>
    );
};

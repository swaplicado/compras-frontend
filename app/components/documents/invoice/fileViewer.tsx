import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import xmlFormatter from 'xml-formatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';
import { promises } from 'dns';

interface FileInfo {
    url: string;
    name: string;
    extension: string;
    id?: string | number;
}

interface FileViewerProps {
    lFiles: FileInfo[];
}

type FileExtension = 'xml' | 'xls' | 'xlsx' | 'pdf' | 'jpg' | 'jpeg' | 'png' | 'txt';

export const CustomFileViewer: React.FC<FileViewerProps> = ({ lFiles }) => {
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const [fileContent, setFileContent] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [objectUrl, setObjectUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { t } = useTranslation('fileViewer');
    const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);
    const previousObjectUrlRef = useRef<string>('');
    // const currentFile = useMemo(() => lFiles[currentFileIndex], [lFiles, currentFileIndex]);
    const [currentFile, setCurrentFile] = useState(lFiles[currentFileIndex]);
    const canRender = ['pdf', 'jpg', 'jpeg', 'png'];

    const cleanupResources = useCallback(() => {
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel('Operation canceled due to new request');
            cancelTokenSourceRef.current = null;
        }

        if (previousObjectUrlRef.current) {
            URL.revokeObjectURL(previousObjectUrlRef.current);
            previousObjectUrlRef.current = '';
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanupResources();
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [cleanupResources, objectUrl]);

    useEffect(() => {
        setCurrentFile(lFiles[currentFileIndex]);
    }, [currentFileIndex])

    useEffect(() => {
        cleanupResources();
        setError('');
        setFileContent('');

        if (objectUrl) {
            previousObjectUrlRef.current = objectUrl;
            setObjectUrl('');
        }

        if (!currentFile?.url) return;

        if (currentFile.extension == 'xml') {
            fetchXmlContent(currentFile.url);
        } else  if (canRender.includes(currentFile?.extension)){
            loadFile(currentFile.url);
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

            cancelTokenSourceRef.current = axios.CancelToken.source();

            const response: AxiosResponse<string> = await axios.get(url, {
                responseType: 'text',
                timeout: 10000,
                cancelToken: cancelTokenSourceRef.current.token
            });

            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            setFileContent(response.data);
            cancelTokenSourceRef.current = null;
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

            cancelTokenSourceRef.current = axios.CancelToken.source();

            const response: AxiosResponse<Blob> = await axios.get(url, {
                responseType: 'blob',
                timeout: 10000,
                cancelToken: cancelTokenSourceRef.current.token
            });

            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const blob = response.data;
            const urlObject = URL.createObjectURL(blob);
            setObjectUrl(urlObject);
            cancelTokenSourceRef.current = null;
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
                                height: '500px',
                                width: '100%',
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
                                {/* <Button label={t('downloadFile')} icon="pi pi-download" onClick={() => window.open(currentFile.url, '_blank')} /> */}
                            </div>
                        </div>
                    );
    
                case 'jpeg':
                case 'jpg':
                case 'png':
                    return (
                        <div className="flex justify-content-center align-items-center" style={{ height: '500px' }}>
                            <img src={objectUrl} alt={currentFile.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                    );
                default:
                    return objectUrl ? (
                        <iframe src={objectUrl} style={{ height: '500px', border: 'none', width: '100%' }} title={`File Viewer: ${currentFile.name}`} className="w-full border-1 border-gray-200" onLoad={() => setIsLoading(false)} />
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
            <Button label={isExpanded ? t('btnHideFiles') : t('btnShowFiles')} onClick={() => setIsExpanded(!isExpanded)} className="mb-2" icon={isExpanded ? 'pi pi-eye-slash' : 'pi pi-eye'} />

            {isExpanded && (
                <div className="field col-12">
                    <Divider />
                    <div className="flex justify-content-between align-items-center mb-3">
                        <Button icon="pi pi-chevron-left" onClick={() => navigateFile('prev')} disabled={lFiles.length <= 1} className="p-button-text" />

                        <div className="text-center">
                            <h5 className="mb-1">{currentFile.name}</h5>
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

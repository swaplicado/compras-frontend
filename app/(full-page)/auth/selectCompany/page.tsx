'use client';
import React, { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Cookies from 'js-cookie';
import loaderScreen from '@/app/components/commons/loaderScreen';
import axios from 'axios';

interface InputValue {
    name: string;
    id: number;
}

const SelectCompany = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [dropdownValue, setDropdownValue] = useState<InputValue | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const [enterCompany, setEnterCompany] = useState(false);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden, background-image', {
        'p-input-filled': layoutConfig.inputStyle === 'filled'
    });

    const Sdata = Cookies.get('lCompany');
    const data = Sdata ? JSON.parse(Sdata) : null;
    let lData = [];
    if (data) {
        for (let i = 0; i < data.length; i++) {
            lData.push({ name: data[i].work_instance_name, id: data[i].id_work_instance });
        }
    }

    const dropdownValues: InputValue[] = lData;

    const checkCompany = () => {
        if (!dropdownValue) {
            showToast('Selecciona una empresa');
            return false;
        }
        return true;
    };

    const handleCompany = async () => {
        try {
            setEnterCompany(true);
            if (!checkCompany()) {
                return;
            }
            setLoading(true);
            if (dropdownValue) {
                const response = await axios.post('/api/auth/selectCompany', {
                    "id_work_instance": dropdownValue.id
                });
                
                Cookies.remove('lCompany');
                Cookies.set('companyName', dropdownValue.name);

                router.push('/');
            } else {
                showToast('Selecciona una empresa');
                setLoading(false);
            }
        } catch (error) {
            // console.error('Error al enviar los datos:', error);
            // showToast('error al enviar los datos')
            if (axios.isAxiosError(error)) {
                showToast(error.response?.data.error || error.message);
            } else {
                showToast('Error desconocido:');
            }
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setLoading(true);
        window.location.href = '/auth/logout';
    }

    const showToast = (message: string) => {
        toast.current?.show({
            severity: 'warn',
            summary: 'Error:',
            detail: message,
            life: 10000
        });
    };

    return (
        <div className={containerClassName}>
            {loading && (
                loaderScreen()
            )}
            <div className='flex flex-column align-items-center justify-content-center'>
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt='Sakai logo' className='mb-5 w-6rem flex-shrink-0' />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'var(--primary-color)'
                    }}
                >
                    <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
                        <div>
                            <div className='mb-5'>
                                <label htmlFor='username' className='block text-900 text-xl font-medium mb-2'>
                                    Empresa
                                </label>
                                <Dropdown 
                                    value={dropdownValue} 
                                    onChange={e => setDropdownValue(e.value)} 
                                    options={dropdownValues} 
                                    optionLabel='name' 
                                    placeholder='Selecciona empresa' 
                                    className={classNames({ 'p-invalid': enterCompany && !dropdownValue }, 'w-full md:w-30rem')}
                                />
                                {
                                    enterCompany && !dropdownValue && (
                                    <small id="username-help" className="block p-error">
                                        Por favor selecciona una empresa.
                                    </small>)
                                }
                            </div>
                            
                            <div className='flex align-items-center justify-content-between mb-5 gap-5'>
                                <Button label='Salir' className="flex align-items-center justify-content-center bg-primary font-bold border-round " onClick={handleLogout}></Button>
                                <Button label='Continuar' className="flex align-items-center justify-content-center bg-primary font-bold border-round " onClick={handleCompany}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default SelectCompany;

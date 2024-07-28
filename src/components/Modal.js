import { useEffect, useState } from "react";
import { useInitialConfigContext } from "@/context/InitialConfigContext";

export default function InitialConfig() {
    const { showModal, setShowModal, devEnvVariables, setDevEnvVariables, prodEnvVariables, setProdEnvVariables } = useInitialConfigContext();

    const [postmanEnv, setPostmanEnv] = useState({
        ENABLED: false,
        CLIENT_SECRET: '',
        CLIENT_ID: '',
        API_KEY: '',
        IMS: 'ims-na1.adobelogin.com',
        IMS_ORG: '',
        TECHNICAL_ACCOUNT_ID: '',
        ACCESS_TOKEN: '',
        SANDBOX_NAME: '',
        SCOPES: '',
        META_SCOPE: ''
    });

    const saveToLocalStorage = () => {
        const configKey = "aepHelpersConfig";

        localStorage.setItem(
            configKey,
            JSON.stringify({
                configured: true,
                dev: { ...devEnvVariables, ENABLED: true, SANDBOX_NAME: 'dev', IMS: 'ims-na1.adobelogin.com' },
                prod: { ...prodEnvVariables, ENABLED: false, SANDBOX_NAME: 'prod', IMS: 'ims-na1.adobelogin.com' },
            })
        );
    };

    const handleDevChange = (e) => {
        const { name, value } = e.target;

        if (name === 'CLIENT_ID') {
            setDevEnvVariables((prev) => ({
                ...prev,
                'API_KEY': value,
            }));
        }

        setDevEnvVariables((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProdChange = (e) => {
        const { name, value } = e.target;

        if (name === 'CLIENT_ID') {
            setProdEnvVariables((prev) => ({
                ...prev,
                'API_KEY': value,
            }));
        }

        setProdEnvVariables((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handlePostmanChange = (e) => {
        const { value } = e.target;
        const _object = JSON.parse(value);

        if(!_object || !_object.values) return;

        const detectedEnv = _object.values.filter(item => item.key === 'SANDBOX_NAME');
        if(!detectedEnv || !detectedEnv.length === 0) return;

        const SANDBOX_NAME = detectedEnv[0].value;
        const CLIENT_SECRET = _object.values.filter(item => item.key === 'CLIENT_SECRET')[0].value;
        const CLIENT_ID = _object.values.filter(item => item.key === 'CLIENT_ID')[0].value;
        const API_KEY = _object.values.filter(item => item.key === 'API_KEY')[0].value;
        const IMS_ORG = _object.values.filter(item => item.key === 'IMS_ORG')[0].value;
        const TECHNICAL_ACCOUNT_ID = _object.values.filter(item => item.key === 'TECHNICAL_ACCOUNT_ID')[0].value;
        const ACCESS_TOKEN = _object.values.filter(item => item.key === 'ACCESS_TOKEN')[0].value;
        const SCOPES = _object.values.filter(item => item.key === 'SCOPES')[0].value;
        const META_SCOPE = _object.values.filter(item => item.key === 'META_SCOPE')[0].value;

        const structure = {
            ENABLED: false,
            CLIENT_SECRET: CLIENT_SECRET,
            CLIENT_ID: CLIENT_ID,
            API_KEY: API_KEY,
            IMS: 'ims-na1.adobelogin.com',
            IMS_ORG: IMS_ORG,
            TECHNICAL_ACCOUNT_ID: TECHNICAL_ACCOUNT_ID,
            ACCESS_TOKEN: '',
            SANDBOX_NAME: SANDBOX_NAME,
            SCOPES: SCOPES,
            META_SCOPE: META_SCOPE
        }

        if(Object.values(structure).some(value => value === undefined)) return;

        if(SANDBOX_NAME === 'dev') setDevEnvVariables(structure);
        else if(SANDBOX_NAME === 'prod') setProdEnvVariables(structure);

        return;
    };

    const postmanForm = () => {
        return (
            <>
                <div className="sm:col-span-4">
                    <label htmlFor="postmanForm" className="block text-sm font-medium leading-6 text-gray-900">
                        Postman
                    </label>
                    <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <textarea required defaultValue={'{}'} onChange={handlePostmanChange}
                                name="postmanForm"
                                placeholder="{}"
                                autoComplete="postmanForm"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return !showModal ? <></> : (
        <div className="modal container m-4 w-auto">
            <div className="modal-content">
                <form className="shadow-2xl rounded-lg" onSubmit={(e) => e.preventDefault()}>
                    <div className="">
                        <div className="flex flex-row gap-x-12 py-6 px-8">
                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-sm font-semibold text-gray-900">DEV</h3>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-1 start">
                                    {postmanForm()}
                                    <div className="sm:col-span-4">
                                        <label htmlFor="CLIENT_SECRET_DEV" className="block text-sm font-medium leading-6 text-gray-900">
                                            Client secret
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={devEnvVariables.CLIENT_SECRET} onChange={handleDevChange}
                                                    name="CLIENT_SECRET"
                                                    type="password"
                                                    placeholder="xx-_xxxxxxxxxxx"
                                                    autoComplete="CLIENT_SECRET"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="CLIENT_ID_DEV" className="block text-sm font-medium leading-6 text-gray-900">
                                            Client ID
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={devEnvVariables.CLIENT_ID} onChange={handleDevChange}
                                                    id="CLIENT_ID_DEV"
                                                    name="CLIENT_ID"
                                                    type="password"
                                                    placeholder="xxxxxxxxxxxxx"
                                                    autoComplete="CLIENT_ID"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="IMS_ORG_DEV" className="block text-sm font-medium leading-6 text-gray-900">
                                            IMS
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={devEnvVariables.IMS_ORG} onChange={handleDevChange}
                                                    id="IMS_ORG_DEV"
                                                    name="IMS_ORG"
                                                    type="text"
                                                    placeholder="EX872KAS@adobeOrg"
                                                    autoComplete="IMS_ORG"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="TECHNICAL_ACCOUNT_ID_DEV" className="block text-sm font-medium leading-6 text-gray-900">
                                            Tech. account ID
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={devEnvVariables.TECHNICAL_ACCOUNT_ID} onChange={handleDevChange}
                                                    id="TECHNICAL_ACCOUNT_ID_DEV"
                                                    name="TECHNICAL_ACCOUNT_ID"
                                                    type="text"
                                                    placeholder="EX87@techacc.com"
                                                    autoComplete="TECHNICAL_ACCOUNT_ID"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="ACCESS_TOKEN_DEV" className="block text-sm font-medium leading-6 text-gray-900">
                                            Access token
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={devEnvVariables.ACCESS_TOKEN} onChange={handleDevChange}
                                                    id="ACCESS_TOKEN_DEV"
                                                    name="ACCESS_TOKEN"
                                                    type="password"
                                                    placeholder="xxxxxx.xxx"
                                                    autoComplete="ACCESS_TOKEN"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="SCOPES_DEV" className="block text-sm font-medium leading-6 text-gray-900">
                                            Scopes
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={devEnvVariables.SCOPES} onChange={handleDevChange}
                                                    id="SCOPES_DEV"
                                                    name="SCOPES"
                                                    type="text"
                                                    placeholder="one,two.allow"
                                                    autoComplete="SCOPES"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="META_SCOPE_DEV" className="block text-sm font-medium leading-6 text-gray-900">
                                            Meta scope
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={devEnvVariables.META_SCOPE} onChange={handleDevChange}
                                                    id="META_SCOPE_DEV"
                                                    name="META_SCOPE"
                                                    type="text"
                                                    placeholder="one,two.allow"
                                                    autoComplete="META_SCOPE"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-sm font-semibold text-gray-900">PROD</h3>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-1 end">
                                    {postmanForm()}
                                    <div className="sm:col-span-4">
                                        <label htmlFor="CLIENT_SECRET" className="block text-sm font-medium leading-6 text-gray-900">
                                            Client secret
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={prodEnvVariables.CLIENT_SECRET} onChange={handleProdChange}
                                                    id="CLIENT_SECRET"
                                                    name="CLIENT_SECRET"
                                                    type="password"
                                                    placeholder="xx-_xxxxxxxxxxx"
                                                    autoComplete="CLIENT_SECRET"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="CLIENT_ID" className="block text-sm font-medium leading-6 text-gray-900">
                                            Client ID
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={prodEnvVariables.CLIENT_ID} onChange={handleProdChange}
                                                    id="CLIENT_ID"
                                                    name="CLIENT_ID"
                                                    type="password"
                                                    placeholder="xxxxxxxxxxxxx"
                                                    autoComplete="CLIENT_ID"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="IMS_ORG" className="block text-sm font-medium leading-6 text-gray-900">
                                            IMS
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={prodEnvVariables.IMS_ORG} onChange={handleProdChange}
                                                    id="IMS_ORG"
                                                    name="IMS_ORG"
                                                    type="text"
                                                    placeholder="EX872KAS@adobeOrg"
                                                    autoComplete="IMS_ORG"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="TECHNICAL_ACCOUNT_ID" className="block text-sm font-medium leading-6 text-gray-900">
                                            Tech. account ID
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={prodEnvVariables.TECHNICAL_ACCOUNT_ID} onChange={handleProdChange}
                                                    id="TECHNICAL_ACCOUNT_ID"
                                                    name="TECHNICAL_ACCOUNT_ID"
                                                    type="text"
                                                    placeholder="EX87@techacc.com"
                                                    autoComplete="TECHNICAL_ACCOUNT_ID"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="ACCESS_TOKEN" className="block text-sm font-medium leading-6 text-gray-900">
                                            Access token
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={prodEnvVariables.ACCESS_TOKEN} onChange={handleProdChange}
                                                    id="ACCESS_TOKEN"
                                                    name="ACCESS_TOKEN"
                                                    type="password"
                                                    placeholder="xxxxxx.xxx"
                                                    autoComplete="ACCESS_TOKEN"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="SCOPES" className="block text-sm font-medium leading-6 text-gray-900">
                                            Scopes
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={prodEnvVariables.SCOPES} onChange={handleProdChange}
                                                    id="SCOPES"
                                                    name="SCOPES"
                                                    type="text"
                                                    placeholder="one,two.allow"
                                                    autoComplete="SCOPES"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-4">
                                        <label htmlFor="META_SCOPE" className="block text-sm font-medium leading-6 text-gray-900">
                                            Meta scope
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input required defaultValue={prodEnvVariables.META_SCOPE} onChange={handleProdChange}
                                                    id="META_SCOPE"
                                                    name="META_SCOPE"
                                                    type="text"
                                                    placeholder="one,two.allow"
                                                    autoComplete="META_SCOPE"
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between text-base font-semibold text-gray-900 px-8 pb-4">
                            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => {
                                setShowModal(false);
                            }}>Cancel</button>
                            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => {
                                saveToLocalStorage();
                                setShowModal(false);
                            }}>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
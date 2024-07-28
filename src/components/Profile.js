'use client'

import { useInitialConfigContext } from "@/context/InitialConfigContext";
import { useGeneralContext } from "@/context/GeneralContext";

import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { useEffect } from "react";

export default function Profile() {
    const { showModal, setShowModal, envVariables, setEnvVariables, devEnvVariables, setDevEnvVariables, prodEnvVariables, setProdEnvVariables } = useInitialConfigContext();

    const { identifier, setIdentifier, identifierNamespace, setIdentifierNamespace, response, setResponse } = useGeneralContext();

    const handleIdentifierChange = (e) => {
        if(!e.target?.value) return;
        setIdentifier(e.target.value);
    };

    useEffect(() => {
        if(identifier.length < 13 || identifier.length > 64) setIdentifierNamespace('Unknown identifier');
        else if (identifier.length === 13) setIdentifierNamespace('pairwise');
        else if (identifier.length === 38) setIdentifierNamespace('ecid');
        else if (identifier.length === 64) setIdentifierNamespace('email_lc_sha256');
    }, [identifier]);

    const handleSubmitResponse = (e) => {
        e.preventDefault();
        handleCall();
    };

    const handleCheckbox = (e) => {
        const { checked } = e.target;

        if (checked) {
            setEnvVariables({ ...prodEnvVariables, ENABLED: true });
        } else {
            setEnvVariables({ ...devEnvVariables, ENABLED: true });
        }
    }

    const handleCall = async () => {
        if (!identifier && !identifierNamespace) return;
        if (identifier.length < 13 || identifier.length > 64) return;

        const response = await fetch(`https://platform.adobe.io/data/core/ups/access/entities?schema.name=_xdm.context.profile&entityIdNS=${identifierNamespace}&entityId=${identifier}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${envVariables.ACCESS_TOKEN}`,
                'x-api-key': `${envVariables.API_KEY}`,
                'x-gw-ims-org-id': `${envVariables.IMS_ORG}`,
                'x-sandbox-name': `${envVariables.SANDBOX_NAME}`,
            },
        });

        const data = await response.json();

        setResponse(data);
    }

    return (
        <div className="flex flex-row container m-4 w-100 h-[40rem] my-8 shadow-2xl rounded-lg">
            <div className="container flex flex-col w-1/2 p-4 gap-4">
                <form onSubmit={handleSubmitResponse}>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-1 start">
                        <div className="sm:col-span-4">
                            <label htmlFor="Namespace" className="block text-sm font-medium leading-6 text-gray-900">
                                Identifier namespace
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input required value={identifierNamespace} onChange={e => setIdentifierNamespace(e.target.value)}
                                        name="identifierNamespace"
                                        type="text"
                                        placeholder="pairwise"
                                        autoComplete="identifierNamespace"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="identifier" className="block text-sm font-medium leading-6 text-gray-900">
                                Value indentifier
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input required defaultValue={identifier} onChange={handleIdentifierChange}
                                        name="identifier"
                                        type="text"
                                        placeholder="abl41msaq"
                                        autoComplete="identifier"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="flex flex-col justify-between text-base font-semibold text-gray-900">
                    <label className="relative flex justify-between items-center group text-sm">
                        Production
                        <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" onChange={handleCheckbox} />
                        <span className="w-8 h-4 flex items-center flex-shrink-0 ml-4 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4 group-hover:after:translate-x-1"></span>
                    </label>
                </div>
                <div className="flex flex-col gap-y-4 end mt-auto">
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white my-4 p-2 border border-blue-500 hover:border-transparent rounded" onClick={handleCall}>Make request</button>
                </div>
            </div>

            <div className="container w-100 border-l-2 border-slate-200 overflow-y-auto bg-indigo-50 font-bold">
                {Object.keys(response).length !== 0 ? <JsonView value={response} style={vscodeTheme} className="h-100 p-4" /> : <pre className="text-black p-2">{JSON.stringify({})}</pre>}
            </div>
        </div>
    );
}
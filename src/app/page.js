'use client'
import { useEffect, useState } from "react";

import JsonView from '@uiw/react-json-view';
import { gruvboxTheme } from '@uiw/react-json-view/gruvbox';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { darkTheme } from '@uiw/react-json-view/dark';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import { vscodeTheme } from '@uiw/react-json-view/vscode';

export default function Home() {
  const constants = {
    pairwise: 13,
    ecid: 38,
    email_lc_sha256: 65,
  }

  const [showModal, setShowModal] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [identifierNamespace, setIdentifierNamespace] = useState('pairwise');
  const [response, setResponse] = useState({});
  const [envVariables, setEnvVariables] = useState({});
  const [devEnvVariables, setDevEnvVariables] = useState({
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
    META_SCOPE: '',
  });

  const [prodEnvVariables, setProdEnvVariables] = useState({
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
    META_SCOPE: '',
  });

  useEffect(() => {
    const configKey = "aepHelpersConfig";
    const config = localStorage.getItem(configKey);

    if (!config || !(JSON.parse(config)).configured) {
      localStorage.setItem(
        configKey,
        JSON.stringify({
          configured: false,
          dev: {
            ENABLED: true,
            CLIENT_SECRET: '',
            CLIENT_ID: '',
            API_KEY: '',
            IMS: 'ims-na1.adobelogin.com',
            IMS_ORG: '',
            TECHNICAL_ACCOUNT_ID: '',
            ACCESS_TOKEN: '',
            SANDBOX_NAME: '',
            SCOPES: '',
            META_SCOPE: '',
          },
          prod: {
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
            META_SCOPE: '',
          }
        })
      );
      setShowModal(true);
    }

    if (config) {
      const { configured, dev, prod } = JSON.parse(config);
      if (!configured) setShowModal(true);

      setDevEnvVariables({ ...dev });
      setProdEnvVariables({ ...prod });

      if (configured && dev.ENABLED) setEnvVariables({ ...dev, ENABLED: true });
      else if (configured && prod.ENABLED) setEnvVariables({ ...prod, ENABLED: true });
    }
  }, []);

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

  const handleIdentifierChange = (e) => {
    const { value } = e.target;

    if(value.length == 13) setIdentifierNamespace('pairwise');
    if(value.length == 38) setIdentifierNamespace('ecid');
    if(value.length == 64) setIdentifierNamespace('email_lc_sha256');

    setIdentifier(value);
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

  const handleSubmit = (e) => e.preventDefault();
  const handleSubmitResponse = (e) => {
    e.preventDefault();
    handleCall();
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
    if(identifier.length < 13 || identifier.length > 64) return;

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
    console.log(data);
  }

  return (
    <main className="flex min-h-screen flex-col items-center h-auto justify-center bg-slate-100">
      {showModal ? (
        <div className="modal container m-4 w-auto">
          <div className="modal-content">
            <form className="shadow-2xl rounded-lg" onSubmit={handleSubmit}>
              <div className="">
                {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Variables</h2> */}
                <div className="flex flex-row gap-x-12 py-6 px-8">
                  <div className="flex flex-col gap-y-4">
                    <h3 className="text-sm font-semibold text-gray-900">DEV</h3>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-1 start">
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
      ) : (
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
                    <input required defaultValue={identifierNamespace} onChange={e => setIdentifierNamespace(e.target.value)}
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
              <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" onChange={handleCheckbox}/>
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

      )}
    </main>
  );
}

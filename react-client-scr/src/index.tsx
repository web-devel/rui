import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app/App";
// import registerServiceWorker from './registerServiceWorker';
import {CubaAppProvider} from "@cuba-platform/react-core";
import {I18nProvider} from "@cuba-platform/react-ui";
import {HashRouter, Route} from "react-router-dom";
import {initializeApp} from "@cuba-platform/rest";
import {CUBA_APP_URL, REST_CLIENT_ID, REST_CLIENT_SECRET} from "./config";
import "mobx-react-lite/batchingForReactDom";

import "antd/dist/antd.min.css";
import "@cuba-platform/react-ui/dist/index.min.css";
import "./index.css";
import {antdLocaleMapping, messagesMapping} from "./i18n/i18nMappings";
import "moment/locale/ru";
import "moment/locale/fr";
import {DevSupport} from "./dev/Dev";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

export const cubaREST = initializeApp({
  name: "scr",
  apiUrl: CUBA_APP_URL,
  restClientId: REST_CLIENT_ID,
  restClientSecret: REST_CLIENT_SECRET,
  storage: window.localStorage,
  defaultLocale: "en"
});


const client = new ApolloClient({
  uri: 'http://localhost:3000/app-portal/graphql',
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <CubaAppProvider cubaREST={cubaREST}>
      <I18nProvider
        messagesMapping={messagesMapping}
        antdLocaleMapping={antdLocaleMapping}
      >
        <HashRouter>
          <DevSupport>
            <Route component={App}/>
          </DevSupport>
        </HashRouter>
      </I18nProvider>
    </CubaAppProvider>
  </ApolloProvider>,
  document.getElementById("root") as HTMLElement
);
// registerServiceWorker();

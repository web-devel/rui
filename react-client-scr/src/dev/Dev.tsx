import React, {useEffect} from "react";
import {Route, Switch} from "react-router-dom";
import {useMainStore} from "@cuba-platform/react-core";
import {Spin} from "antd";
import {DEV_MODE} from "../config";
import {useObserver} from "mobx-react";
import CarEdit2Component from "../app/entity-management2/CarEdit2";
import CarEditComponent from "../app/entity-management/CarEdit";

export const ComponentPreviews = () =>
  <Switch>
    <Route path="/car-edit">
      <CarEditComponent entityId={'new'} />
    </Route>
  </Switch>


export const DevBootstrap: React.FC = () => {
  const mainStore = useMainStore();
  useEffect(
    () => {
      if (!mainStore.authenticated) {
        mainStore.login('admin', 'admin')
      }
    },
    [mainStore]
  )
  return useObserver(() => {
      if (!mainStore.authenticated) {
        return <Spin/>
      }
      return <ComponentPreviews/>
    }
  )
}

export const DevSupport: React.FC = ({children}) => {
  if (DEV_MODE) {
    return <Route component={DevBootstrap}/>
  } else {
    return <>{children}</>
  }
}
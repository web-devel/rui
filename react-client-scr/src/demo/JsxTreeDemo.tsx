import {Component, ReactNode} from "react";
import {Card, Form, Icon, Layout, Menu, Spin} from "antd";
import AppHeader from "../app/header/AppHeader";
import {NavLink, Route, Switch} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import {menuItems} from "../routing";
import HomePage from "../app/home/HomePage";
import * as React from "react";
import Centered from "../app/common/Centered";
import {FormField} from "@cuba-platform/react-ui";
import {Car} from "../cuba/entities/scr$Car";

type Props = {
  loading: string
}

class ClassBasedComponent extends Component<Props, never> {
  render() {
    const {loading} = this.props;
    if (loading) {
      return <Centered>
        <Spin/>
      </Centered>
    }

    return (
      <Layout className="main-layout">
        <Layout.Header>
          <AppHeader/>
        </Layout.Header>
        <Layout className="layout-container">
          <Layout.Sider
            width={200}
            breakpoint="sm"
            collapsedWidth={0}
            className="layout-sider"
          >
            <Menu mode="inline" style={{height: "100%", borderRight: 0}}>
              <Menu.Item>
                <NavLink to={"/"}>
                  <Icon type="home"/>
                  <FormattedMessage id="router.home"/>
                </NavLink>
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout className="layout-content">
            <Layout.Content>
              <Switch>
                <Route exact={true} path="/" component={HomePage}/>
              </Switch>
              <FunctionalComponent>sad</FunctionalComponent>
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

function FunctionalComponent(): React.FC {
  return <Card>
    <Form>
      <FormField entityName={Car.NAME} propertyName={"manufacturer"}>
      </FormField>
    </Form>
  </Card>
}

const FunctionalArrowComponent = () => {
  return <div></div>
}
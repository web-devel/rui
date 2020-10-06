import * as React from "react";
import {Component} from "react";
import {Card, Form, Icon, Layout, Menu, Spin} from "antd";
import AppHeader from "../app/header/AppHeader";
import {NavLink, Route, Switch} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import HomePage from "../app/home/HomePage";
import Centered from "../app/common/Centered";

type Props = {
  loading: boolean
}


export const FunctionalArrowComponent: React.FC = () => {
  return <Card>
    <Form>
    </Form>
  </Card>
}

export class ClassBasedComponent extends Component<Props, never> {
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
              <FunctionalArrowComponent>sad</FunctionalArrowComponent>
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

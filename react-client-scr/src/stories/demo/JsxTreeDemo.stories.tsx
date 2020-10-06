import AppHeader from "../../app/header/AppHeader";
import {Meta, Story} from "@storybook/react/types-6-0";
import React from "react";
import {ClassBasedComponent} from "../../demo/JsxTreeDemo";

export default {
  title: 'Demo',
  component: ClassBasedComponent,
} as Meta;

export const AppHeaderStory: Story<any> = () =>
  <ClassBasedComponent loading={false}/>
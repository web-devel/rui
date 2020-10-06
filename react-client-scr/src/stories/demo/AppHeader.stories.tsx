import React from 'react';

import {Meta, Story} from "@storybook/react/types-6-0";
import AppHeader from "../../app/header/AppHeader";

export default {
  title: 'AppHeader',
  component: AppHeader,
} as Meta;

export const AppHeaderStory: Story<any> = () =>
  <AppHeader/>
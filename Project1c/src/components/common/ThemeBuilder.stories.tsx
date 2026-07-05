import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ThemeBuilder } from './ThemeBuilder';
import { ThemeContext, themes } from '../../lib/theme';

const meta: Meta<typeof ThemeBuilder> = {
  title: 'Common/Theme Builder',
  component: ThemeBuilder,
  decorators: [
    (Story) => (
      <ThemeContext.Provider value={{ theme: themes.meridian, setThemeId: () => {} }}>
        <Story />
      </ThemeContext.Provider>
    )
  ],
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ThemeBuilder>;

export const Default: Story = {
  name: 'Theme Builder'
};

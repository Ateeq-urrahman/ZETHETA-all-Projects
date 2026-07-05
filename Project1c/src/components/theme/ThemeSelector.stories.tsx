import type { Meta, StoryObj } from '@storybook/react';
import { ThemeContext, themes } from '../../lib/theme';
import { ThemeSelector } from './ThemeSelector';

const meta: Meta<typeof ThemeSelector> = {
  title: 'Theme/Selector',
  component: ThemeSelector,
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

type Story = StoryObj<typeof ThemeSelector>;

export const Default: Story = {
  name: 'Theme Selector'
};

export const WithNeutralTheme: Story = {
  name: 'Neutral Theme Selected',
  decorators: [
    (Story) => (
      <ThemeContext.Provider value={{ theme: themes.neutral, setThemeId: () => {} }}>
        <Story />
      </ThemeContext.Provider>
    )
  ]
};

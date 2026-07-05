import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from './Dashboard';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/Command Center',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Institutional portfolio analytics dashboard with real-time data, drag-and-drop layout, and theming capabilities.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
  name: 'Portfolio Analytics Dashboard',
  parameters: {
    docs: {
      description: {
        story: 'Main dashboard showing portfolio overview with 10 configurable widgets. Features real-time mock data, drag-and-drop layout, layout history, and theme customization.'
      }
    }
  }
};

export const Mobile: Story = {
  name: 'Mobile View',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
};

export const Tablet: Story = {
  name: 'Tablet View',
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  }
};

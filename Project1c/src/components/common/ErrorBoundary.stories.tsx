import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Common/Error Boundary',
  component: ErrorBoundary,
  parameters: {
    docs: {
      description: {
        component: 'Error boundary component for handling React errors at different levels (global or widget-specific).'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ErrorBoundary>;

const ThrowError = () => {
  throw new Error('This is a test error from Storybook');
};

export const WidgetLevel: Story = {
  args: {
    level: 'widget',
    children: <ThrowError />
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary at widget level - shows isolated error message without affecting other widgets.'
      }
    }
  }
};

export const GlobalLevel: Story = {
  args: {
    level: 'global',
    children: <ThrowError />
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary at global level - shows error in full-screen error state.'
      }
    }
  }
};

export const WithCustomFallback: Story = {
  args: {
    level: 'widget',
    fallback: <div style={{ padding: '2rem', textAlign: 'center' }}>Custom error fallback UI</div>,
    children: <ThrowError />
  },
  parameters: {
    docs: {
      description: {
        story: 'Error boundary with custom fallback component.'
      }
    }
  }
};

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { WidgetConfig } from './WidgetConfig';
import type { WidgetInstance } from '../../lib/types';

const meta: Meta<typeof WidgetConfig> = {
  title: 'Common/Widget Config',
  component: WidgetConfig,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof WidgetConfig>;

const MockWidgetConfig = () => {
  const [isOpen, setIsOpen] = useState(true);
  const mockWidget: WidgetInstance = {
    id: 'test-widget',
    widgetType: 'portfolio-summary',
    title: 'Portfolio Snapshot',
    x: 0,
    y: 0,
    width: 2,
    height: 1,
    config: {}
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Config</button>
      <WidgetConfig
        instance={mockWidget}
        onSave={(instance) => console.log('Saved:', instance)}
        onCancel={() => setIsOpen(false)}
        isOpen={isOpen}
      />
    </>
  );
};

export const Default: Story = {
  render: () => <MockWidgetConfig />
};

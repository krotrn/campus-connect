import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { TabItem } from '@/types/ui';

interface ReusableTabsProps {
  tabs: TabItem[];
  defaultValue: string;
  className?: string;
  tabsListClassName?: string;
  tabsContentClassName?: string;
}
export function ReusableTabs({
  tabs,
  defaultValue,
  className = '',
  tabsListClassName = '',
  tabsContentClassName = '',
}: ReusableTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue}
      className={`w-full ${className}`}
    >
      <TabsList className={`grid w-full ${tabsListClassName}`} style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={`pt-4 ${tabsContentClassName}`}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

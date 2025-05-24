'use client';

import React from 'react';
import { Button } from '../ui/button';

export function SimpleButton({ children }: { children: React.ReactNode }) {
  return (
    <Button type='submit' onSubmit={(e) => e.preventDefault()}>
      {children}
    </Button>
  );
}

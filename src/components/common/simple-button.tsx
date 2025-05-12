'use client';

import { Button } from '../ui/button';

export function SimpleButton({
  title,
  action,
}: {
  title: string;
  action: () => unknown;
}) {
  return <Button onClick={action}>{title}</Button>;
}

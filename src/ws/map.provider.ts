import { Provider } from '@nestjs/common';

const MY_MAP = new Map<string, any>();

export const MapProvider: Provider = {
  provide: 'MyMap',
  useValue: MY_MAP,
};

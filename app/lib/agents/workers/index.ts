import { gmailWorker } from './gmail';
import { driveWorker } from './drive';
import { docsWorker } from './docs';
import { sheetsWorker } from './sheets';
import { calendarWorker } from './calendar';
import { GoogleService } from '@/app/types/chat';
import { BaseWorker } from './base';

/**
 * Worker registry for all Google services
 */
export const workers: Record<GoogleService, BaseWorker> = {
  gmail: gmailWorker,
  drive: driveWorker,
  docs: docsWorker,
  sheets: sheetsWorker,
  calendar: calendarWorker,
};

/**
 * Get worker for a specific service
 */
export function getWorker(service: GoogleService): BaseWorker {
  const worker = workers[service];
  if (!worker) {
    throw new Error(`No worker found for service: ${service}`);
  }
  return worker;
}

export { gmailWorker, driveWorker, docsWorker, sheetsWorker, calendarWorker };

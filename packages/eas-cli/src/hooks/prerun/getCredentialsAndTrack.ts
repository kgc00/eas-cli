import { Hook } from '@oclif/config';

import { AnalyticsEvent, initAsync, logEvent } from '../../analytics';
import { getUserAsync } from '../../user/User';
import { ensureLoggedInAsync } from '../../user/actions';

// could also be split to two commands:
// - authenticateUser during init
// - trackUsage during prerun
const hook: Hook<'prerun'> = async function (opts) {
  const { id, requiresLogin } = opts.Command as any;
  await initAsync();
  if (requiresLogin) {
    await ensureLoggedInAsync();
  } else {
    await getUserAsync();
  }
  logEvent(AnalyticsEvent.ACTION, {
    action: `eas ${id}`,
  });
};

export default hook;

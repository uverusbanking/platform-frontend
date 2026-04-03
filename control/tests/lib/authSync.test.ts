import {
  AUTH_SYNC_STORAGE_KEY,
  AUTH_SYNC_TAB_ID_STORAGE_KEY,
  broadcastLogoutEvent,
  subscribeToLogoutEvent,
} from "@/lib/authSync";

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];

  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  postMessage = jest.fn((message: unknown) => {
    MockBroadcastChannel.instances
      .filter((instance) => instance.name === this.name && instance !== this)
      .forEach((instance) =>
        instance.onmessage?.({ data: message } as MessageEvent),
      );
  });
  close = jest.fn();

  constructor(name: string) {
    this.name = name;
    MockBroadcastChannel.instances.push(this);
  }
}

describe("authSync", () => {
  const originalBroadcastChannel = global.BroadcastChannel;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    MockBroadcastChannel.instances = [];
    global.BroadcastChannel =
      MockBroadcastChannel as unknown as typeof BroadcastChannel;
  });

  afterEach(() => {
    if (originalBroadcastChannel) {
      global.BroadcastChannel = originalBroadcastChannel;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).BroadcastChannel;
    }
  });

  it("broadcasts logout events to other listeners", () => {
    sessionStorage.setItem(AUTH_SYNC_TAB_ID_STORAGE_KEY, "tab-a");
    const handleLogout = jest.fn();
    const unsubscribe = subscribeToLogoutEvent(handleLogout);

    sessionStorage.setItem(AUTH_SYNC_TAB_ID_STORAGE_KEY, "tab-b");
    broadcastLogoutEvent();

    expect(handleLogout).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("reacts to storage fallback events from other tabs and ignores same-tab events", () => {
    sessionStorage.setItem(AUTH_SYNC_TAB_ID_STORAGE_KEY, "tab-a");
    const handleLogout = jest.fn();
    const unsubscribe = subscribeToLogoutEvent(handleLogout);

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: AUTH_SYNC_STORAGE_KEY,
        newValue: JSON.stringify({
          type: "LOGOUT",
          sourceTabId: "tab-b",
          timestamp: Date.now(),
        }),
      }),
    );

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: AUTH_SYNC_STORAGE_KEY,
        newValue: JSON.stringify({
          type: "LOGOUT",
          sourceTabId: "tab-a",
          timestamp: Date.now(),
        }),
      }),
    );

    expect(handleLogout).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});

declare module '@mono.co/connect.js' {
  /**
   * Optional configuration for loading the widget directly to an institution login page.
   */
  interface SetupConfig {
    selectedInstitution: {
      id: string;
      auth_method: 'internet_banking' | 'mobile_banking';
    };
  }

  /**
   * Mono Connect customer object for pre-filling or linking to a known user.
   */
  interface MonoCustomer {
    id?: string;
    name?: string;
    email?: string;
    identity?: {
      type: 'bvn';
      number: string;
    };
  }

  /**
   * The full config required to initialize Mono Connect.
   */
  interface MonoConnectConfig {
    /**
     * Your public Mono API key.
     */
    key: string;

    /**
     * Scope of the connection. E.g., 'auth', 'transactions'.
     */
    scope?: string;

    /**
     * Additional data such as customer information.
     */
    data?: {
      customer: MonoCustomer;
    };

    /**
     * Called when the widget successfully links an account or completes onboarding.
     */
    onSuccess: (data: { code?: string; [key: string]: any }) => void;

    /**
     * Called when the widget is loaded into the DOM.
     */
    onLoad?: () => void;

    /**
     * Called when the user manually closes the widget.
     */
    onClose?: () => void;

    /**
     * Called when a key event occurs during the widget flow.
     */
    onEvent?: (eventName: string, data: Record<string, any>) => void;

    /**
     * Optional unique reference string passed to all events.
     */
    reference?: string;
  }

  /**
   * Mono Connect class instance, providing methods to control the widget.
   */
  class MonoConnect {
    /**
     * Create a new Mono Connect instance.
     * @param config Configuration options for setting up the Mono Connect widget
     */
    constructor(config: MonoConnectConfig);

    /**
     * Opens the Mono Connect widget for the user to interact with.
     */
    open(): void;

    /**
     * Closes the widget programmatically.
     */
    close(): void;

    /**
     * Mounts the widget onto the DOM. Optionally pre-loads a selected institution.
     * @param config Optional institution configuration
     */
    setup(config?: SetupConfig): void;

    /**
     * Loads the reauthorization widget for an already linked account.
     * @param accountId ID of the account to reauthorize
     */
    reauthorise(accountId: string): void;
  }

  export default MonoConnect;
}

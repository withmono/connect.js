import type { AxiosResponse } from "axios";

declare namespace Connect {
  /** `auth` links an account, `reauth` re-authorises one, `payments` starts a direct debit. */
  type Scope = "auth" | "reauth" | "payments" | (string & {});

  type AuthMethod = "internet_banking" | "mobile_banking";

  type DebitType = "one-time-debit" | "recurring-debit";

  type EventName =
    | "LOADED"
    | "OPENED"
    | "EXIT"
    | "ERROR"
    | "INSTITUTION_SELECTED"
    | "AUTH_METHOD_SWITCHED"
    | "SUBMIT_CREDENTIALS"
    | "SUBMIT_MFA"
    | "ACCOUNT_LINKED"
    | "ACCOUNT_SELECTED"
    | "SUCCESS";

  interface Institution {
    id: string;
    name: string;
  }

  /** Which fields are present depends on the event. */
  interface EventData {
    /** The `reference` passed to the constructor. Sent with every event. */
    reference?: string;
    /** Sent with every event. */
    timestamp?: number;
    /** ERROR */
    errorType?: string;
    /** ERROR */
    errorMessage?: string;
    /** SUBMIT_MFA */
    mfaType?: string;
    /** AUTH_METHOD_SWITCHED */
    prevAuthMethod?: AuthMethod;
    /** AUTH_METHOD_SWITCHED, INSTITUTION_SELECTED */
    authMethod?: AuthMethod;
    /** EXIT */
    pageName?: string;
    /** ACCOUNT_SELECTED */
    selectedAccountsCount?: number;
    /** ACCOUNT_LINKED, INSTITUTION_SELECTED */
    institution?: Institution;
    /** Mono's mobile SDK docs list these two instead of `institution`. */
    institutionId?: string;
    institutionName?: string;
    /** SUCCESS */
    code?: string;
    [key: string]: unknown;
  }

  interface Customer {
    /** An existing Mono customer. Use this or name, email and identity. */
    id?: string;
    name?: string;
    email?: string;
    identity?: {
      type: "bvn" | (string & {});
      number: string;
    };
  }

  interface Data {
    customer?: Customer;
    /** Set by `reauthorise()`. */
    account?: string;
    /** Direct debit only. */
    type?: DebitType;
    /** Direct debit only, in kobo. */
    amount?: number;
    /** Direct debit only. */
    description?: string;
    [key: string]: unknown;
  }

  interface SelectedInstitution {
    id: string;
    auth_method: AuthMethod;
    /** Used with `check_account_match`. */
    account_number?: string;
  }

  /** Options for `setup()`, merged with the constructor options. */
  interface SetupConfig {
    /** Open the widget on this institution's login page. */
    selectedInstitution?: SelectedInstitution;
    /** Check that `selectedInstitution.account_number` matches the linked account. */
    check_account_match?: boolean;
  }

  interface SuccessData {
    /** Sent when an account is linked. Exchange it for an account id on your server. */
    code?: string;
    /** Direct debit returns a charge object instead of a code. */
    amount?: number;
    transaction_reference?: string;
    type?: string;
    [key: string]: unknown;
  }

  interface Config extends SetupConfig {
    /** Your Mono public key. */
    key: string;
    onSuccess: (data: SuccessData) => void;
    onClose?: () => void;
    onLoad?: () => void;
    onEvent?: (eventName: EventName, data: EventData) => void;
    scope?: Scope;
    data?: Data;
    /** Passed back as `reference` in every `onEvent` call. */
    reference?: string;
  }

  interface Instance {
    readonly key: string;
    /** Mounts the widget, hidden until `open()` is called. */
    setup(config?: SetupConfig): void;
    /** Use instead of `setup()` to re-authorise an account that is already linked. */
    reauthorise(accountId: string): void;
    open(): void;
    close(): void;
    fetchInstitutions(): Promise<AxiosResponse<unknown>>;
  }
}

interface ConnectStatic {
  new (config: Connect.Config): Connect.Instance;
  (config: Connect.Config): Connect.Instance;
}

declare const Connect: ConnectStatic;

declare global {
  interface Window {
    Connect: ConnectStatic;
  }
}

export = Connect;

import { Formatter } from "./formatter.model";

export type WarningRange = {
  range: [number, number];
  isRange: boolean;
  enableToggle: boolean;
};

export interface SettingData {
  headerCap: WarningRange;
  bodyCap: WarningRange;
  removeDoubleSpace: boolean;
  fontSize: number;
};

export const getDefaultSetting: () => SettingData = () => {
  return {
    headerCap: {
      range: [50, 72],
      isRange: true,
      enableToggle: true,
    },
    bodyCap: {
      range: [72, 72],
      isRange: false,
      enableToggle: false,
    },
    removeDoubleSpace: true,
    fontSize: 16,
  };
};

const EMPTY_COMMIT = "Blank page";

/**
 * CommitStorage contains the necessary details to recreate the settings for the page of commit message
 */
export class CommitStorage {
  private _title?: string;

  constructor(
    public commitMessage: string = "",
    public setting: SettingData = getDefaultSetting()
  ) {
  }

  get title(): string {
    if (!this._title) {
      let tmp = new Formatter(this.setting)
        .formatCommitMessage(this.commitMessage)
        .result
        .split("\n")[0];

      this._title = tmp ? tmp : EMPTY_COMMIT;
    }

    return this._title;
  }
}

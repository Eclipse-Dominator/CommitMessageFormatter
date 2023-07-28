import { Formatter } from "./formatter.model";


export interface SettingData {
  headerCap: number;
  bodyCap: number;
  removeDoubleSpace: boolean;
  fontSize: number;
};

export const getDefaultSetting: () => SettingData = () => {
  return {
    headerCap: 50,
    bodyCap: 72,
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

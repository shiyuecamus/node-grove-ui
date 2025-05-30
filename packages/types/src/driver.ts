import type { AdditionalInfo, BaseEntity, StatusInfo } from './base';

import { TagColor } from './color';

// driver type
enum DriverType {
  BUILTIN = 1,
  CUSTOM = 2,
}

// driver type translation
const DriverTypeTrans: Map<DriverType, string> = new Map([
  [DriverType.BUILTIN, 'page.thingsModel.driver.type-builtin'],
  [DriverType.CUSTOM, 'page.thingsModel.driver.type-custom'],
]);

// driver type color
const DriverTypeColor: Map<
  DriverType,
  { borderColor: string; color: string; textColor: string }
> = new Map([
  [DriverType.BUILTIN, TagColor.Cyan],
  [DriverType.CUSTOM, TagColor.Purple],
]);

// driver ext type
enum DriverExtType {
  DLL = 1,
  DYLIB = 3,
  SO = 2,
}

// driver ext type translation
const DriverExtTypeTrans: Map<DriverExtType, string> = new Map([
  [DriverExtType.DLL, 'page.thingsModel.driver.extType-dll'],
  [DriverExtType.DYLIB, 'page.thingsModel.driver.extType-dylib'],
  [DriverExtType.SO, 'page.thingsModel.driver.extType-so'],
]);

// driver ext type color
const DriverExtTypeColor: Map<
  DriverExtType,
  { borderColor: string; color: string; textColor: string }
> = new Map([
  [DriverExtType.DLL, TagColor.Green],
  [DriverExtType.DYLIB, TagColor.Blue],
  [DriverExtType.SO, TagColor.Red],
]);

// DriverInfo interface extends BaseEntity, AdditionalInfo, and StatusInfo
interface DriverInfo extends AdditionalInfo, BaseEntity, StatusInfo {
  name?: string;
  code?: string;
  version?: string;
  description?: string;
  size?: number;
  checksum?: string;
  type?: DriverType;
}

export type { DriverInfo };
export {
  DriverExtType,
  DriverExtTypeColor,
  DriverExtTypeTrans,
  DriverType,
  DriverTypeColor,
  DriverTypeTrans,
};

import { BaseUuidEntity } from "./base/sys$BaseUuidEntity";
import { Car } from "./scr$Car";
export class ScrUserInfo extends BaseUuidEntity {
  static NAME = "ScrUserInfo";
  firstName?: string | null;
  lastName?: string | null;
  favouriteCars?: Car | null;
}
export type ScrUserInfoViewName = "_base" | "_local" | "_minimal";
export type ScrUserInfoView<V extends ScrUserInfoViewName> = never;

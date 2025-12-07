import { User } from "../models/user";
import { Category } from "../models/category";
import { Record } from "../models/record";

let userIdCounter = 1;
let categoryIdCounter = 1;
let recordIdCounter = 1;

export const db = {
  users: [] as User[],
  categories: [] as Category[],
  records: [] as Record[]
};

export function nextUserId(): number {
  return userIdCounter++;
}

export function nextCategoryId(): number {
  return categoryIdCounter++;
}

export function nextRecordId(): number {
  return recordIdCounter++;
}

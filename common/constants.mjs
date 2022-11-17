import { resolve } from '../utils/fileSystem.mjs';

export const page = process.env.PAGE;
export const LIST_DIR = resolve('./listJson');
export const LIST_FILE_NAME = resolve(`${LIST_DIR}/金测评_${page}.json`);
export const DETAIL_DIR = resolve('./detailJson');
export const DETAIL_FILE_NAME = resolve(`${DETAIL_DIR}/金测评_${page}.json`);
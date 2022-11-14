import axios from 'axios';
import fs from 'node:fs';
import { resolve } from '../utils/fileSystem.mjs';
import upload2Cdn from '../utils/qiniuUpload.mjs';

export default async function matchAndUpload(str) {
	const imgReg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
	const matchImgSrcArr = str.match(imgReg);
	const images = [];

	for (let i = 0; i < matchImgSrcArr.length; i++) {
		const matchSrc = matchImgSrcArr[i].match(/src=['"](.*?)['"]/);
		if (matchSrc) {
			images.push(matchSrc[1] || '');
		}
	}

	for (let j = 0; j < images.length; j++) {
		const url = images[j];
		const filenameReg = /.*\/(.*.(png|jpg|jpeg|gif|svg)$)/gi;
		const matchFilename = filenameReg.exec(url);
		let filename;

		if (matchFilename) {
			filename = matchFilename[1];
		}

		const savePath = `${resolve('images')}/${filename}`;
		const writer = fs.createWriteStream(savePath);

		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream',
		});

		response.data.pipe(writer);
		writer.on('finish', async () => {
			await upload2Cdn({
				path: savePath,
				filename,
			});
		});
	}
}

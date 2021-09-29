import Jimp from 'jimp';

import number from './number';

type colorObj = {
	r: number,
	g: number,
	b: number
}

const rgbToHex = (color: colorObj) => {
	const { r, g, b } = color;
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const hexToRgb = (hex: string) => {
	const result = /^#?([a-fd]{2})([a-fd]{2})([a-fd]{2})$/i.exec(hex);
	if (result) {
		const r = parseInt(result[1], 16);
		const g = parseInt(result[2], 16);
		const b = parseInt(result[3], 16);
		return { r, g, b };
	}
	return null;
};

const meanColor = async (imgFile:string) => {
	const image = await Jimp.read(imgFile);

	const { height, width } = image.bitmap;

	const r = [];
	const g = [];
	const b = [];
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const color = image.getPixelColor(x, y);
			const colorRGBA = Jimp.intToRGBA(color);

			r.push(colorRGBA.r);
			g.push(colorRGBA.g);
			b.push(colorRGBA.b);
		}
	}
	const colormatch = { r: number.mean(r), g: number.mean(g), b: number.mean(b) };
	return {
		rgb: colormatch,
		hex: rgbToHex(colormatch)
	};
};

const getColor = async (imgFile:string, x:number, y:number) => {
	const image = await Jimp.read(imgFile);
	const color = image.getPixelColor(x, y);
	const colorRGBA = Jimp.intToRGBA(color);
	const { r, g, b } = colorRGBA;
	const colormatch = { r, g, b };
	return {
		rgb: colormatch,
		hex: rgbToHex(colormatch)
	};
};

export default {
	rgbToHex,
	hexToRgb,
	meanColor,
	getColor
};

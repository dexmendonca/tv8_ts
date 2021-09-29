const atob = (str:any) => Buffer.from(str, 'base64').toString('binary');
const btoa = (str:any) => Buffer.from(str, 'binary').toString('base64');

export default {
	atob,
	btoa,
	base64_encode: btoa,
	base64_decode: atob
};

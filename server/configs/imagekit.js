import ImageKit from 'imagekit';
import dotenv from 'dotenv';
dotenv.config();
if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("Imagekit pbulic key is not defined in env file");
}
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
});
export default imagekit;
// SDK initialization

// var ImageKit = require("imagekit");

// var imagekit = new ImageKit({
//     publicKey : "public_gNcg9Dotrr6SEagRwr1mb6xxnuI=",
//     privateKey : "private_8a5d/jdyb9******************",
//     urlEndpoint : "https://ik.imagekit.io/bwfxxvhes"
// });

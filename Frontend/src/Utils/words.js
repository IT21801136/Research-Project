import image1 from "../images/apple.png";
import image2 from "../images/book.png";
import image3 from "../images/brother.png";
import image4 from "../images/bycycle.png";
import image5 from "../images/chair.png";
import image6 from "../images/dad.png";
import image7 from "../images/eat.png";
import image8 from "../images/fruits.png";
import image9 from "../images/mother.png";
import image10 from "../images/pencil.jpg";
import image11 from "../images/sea.png";
import image12 from "../images/sun.png";
import image13 from "../images/teacher.png";
import image14 from "../images/water.png";
import image15 from "../images/hear.png";
 
import foods from "../images/foods.jpg";
import items from "../images/items.jpg";
import people from "../images/people.jpg";
import actions from "../images/actions.jpg";
import nature from "../images/nature.jpg";

// Base URL for audio files
const AUDIO_BASE_URL = process.env.REACT_APP_AUDIO_BASE_URL;
 
 
// Category definitions
export const CATEGORIES = [
    { id: "ආහාරපාන", name: "ආහාරපාන", img: foods },
    { id: "භාණ්ඩ", name: "භාණ්ඩ", img: items },
    { id: "පුද්ගලයන්", name: "පුද්ගලයන්", img: people },
    { id: "ක්‍රියාපද", name: "ක්‍රියාපද", img: actions },
    { id: "පරිසරය", name: "පරිසරය", img: nature },
];
 
export const WORDS = [
    {
        id: 1,
        name: "ඇපල්",
        label: 'apple',
        imgurl: image1,
        auidoUrl: `${AUDIO_BASE_URL}/apple.ogg`,
        category: "ආහාරපාන"
    },
    {
        id: 2,
        name: "පොත",
        label: 'potha',
        imgurl: image2,
        auidoUrl: `${AUDIO_BASE_URL}/book.ogg`,
        category: "භාණ්ඩ"
    },
    {
        id: 3,
        name: "මල්ලි",
        label: 'malli',
        imgurl: image3,
        auidoUrl: `${AUDIO_BASE_URL}/brother.ogg`,
        category: "පුද්ගලයන්"
    },
    {
        id: 4,
        name: "බයිසිකලය",
        label: 'bicycle',
        imgurl: image4,
        auidoUrl: `${AUDIO_BASE_URL}/bicycle.ogg`,
        category: "භාණ්ඩ"
    },
    {
        id: 5,
        name: "පුටුව",
        label: 'putuwa',
        imgurl: image5,
        auidoUrl: `${AUDIO_BASE_URL}/chair.ogg`,
        category: "භාණ්ඩ"
    },
    {
        id: 6,
        name: "තාත්තා",
        label: 'thaththa',
        imgurl: image6,
        auidoUrl: `${AUDIO_BASE_URL}/dad.ogg`,
        category: "පුද්ගලයන්"
    },
    {
        id: 7,
        name: "කනවා",
        label: 'kanawa',
        imgurl: image7,
        auidoUrl: `${AUDIO_BASE_URL}/eat.ogg`,
        category: "ක්‍රියාපද"
    },
    {
        id: 8,
        name: "පළතුරු",
        label: 'palathuru',
        imgurl: image8,
        auidoUrl: `${AUDIO_BASE_URL}/fruits.ogg`,
        category: "ආහාරපාන"
    },
    {
        id: 9,
        name: "අම්මා",
        label: 'amma',
        imgurl: image9,
        auidoUrl: `${AUDIO_BASE_URL}/mom.ogg`,
        category: "පුද්ගලයන්"
    },
    {
        id: 10,
        name: "පැන්සල",
        label: 'pansala',
        imgurl: image10,
        auidoUrl: `${AUDIO_BASE_URL}/pencil.ogg`,
        category: "භාණ්ඩ"
    },
    {
        id: 11,
        name: "මුහුද",
        label: 'muhuda',
        imgurl: image11,
        auidoUrl: `${AUDIO_BASE_URL}/sea.ogg`,
        category: "පරිසරය"
    },
    {
        id: 12,
        name: "ඉර",
        label: 'ira',
        imgurl: image12,
        auidoUrl: `${AUDIO_BASE_URL}/sun.ogg`,
        category: "පරිසරය"
    },
    {
        id: 13,
        name: "ගුරුතුමා",
        label: 'guruthuma',
        imgurl: image13,
        auidoUrl: `${AUDIO_BASE_URL}/teacher.ogg`,
        category: "පුද්ගලයන්"
    },
    {
        id: 14,
        name: "වතුර",
        label: 'wathura',
        imgurl: image14,
        auidoUrl: `${AUDIO_BASE_URL}/water.ogg`,
        category: "ආහාරපාන"
    },
    {
        id: 15,
        name: "ඇහෙනවා",
        label: 'ahenawa',
        imgurl: image15,
        auidoUrl: `${AUDIO_BASE_URL}/hear.ogg`,
        category: "ක්‍රියාපද"
    }
];
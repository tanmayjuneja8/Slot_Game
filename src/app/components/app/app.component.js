/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable no-unreachable */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { SYMBOLS_RANDOM } from '../../constants/symbols.constants';
import { SlotMachine } from '../slot-machine/slot-machine.component';
import { ToggleButton } from '../toggle-button/toggle-button.component';
import { SMSoundService } from '../../services/slot-machine/sound/slot-machine-sound.service';
// import intlTelInput from 'intl-tel-input';

import './app.style.scss';
import '../header/header.styles.scss';
import '../footer/footer.styles.scss';
// import 'intl-tel-input/build/css/intlTelInput.css';

import referralCodeGenerator from 'referral-code-generator';

const SERVICES = {
    sound: SMSoundService,
};

const handleOptionChange = (key, value) => {
    const service = SERVICES[key];

    if (service) service[value ? 'enable' : 'disable']();

    localStorage.setItem(key, value);
};


export class App {

    // CSS classes:
    static C_FOCUS_ACTIVE = 'focus-active';

    // CSS selectors:
    static S_COINS = '#coins';
    static S_JACKPOT = '#coin_percentage';
    static S_MAIN = '#main';
    static S_TOGGLE_SOUND = '#toggleSound';
    static S_TOGGLE_VIBRATION = '#toggleVibration';
    static S_VIBRATION_INSTRUCTIONS = '#vibrationInstructions';

    // Misc.:
    static ONE_DAY = 1000 * 60 * 60 * 24;
    // Elements:
    coinsElement = document.querySelector(App.S_COINS);
    jackpotElement = document.querySelector(App.S_JACKPOT);

    mainElement = document.querySelector(App.S_MAIN);

    // Components:
    slotMachine;

    coins = 5; ct = 1; percent = 80; time = null; value = localStorage.value = 20;
    coin_percentage = 0; ct1 = 'Have a nice day ahead! 📣🐢';
    lastSpin = localStorage.lastSpin || 0;
    isSoundDisabled = localStorage.sound === 'true';
    isVibrationDisabled = localStorage.vibration === 'false';
    isInstructionDisabled = 'false';
    isFirstTime = localStorage.firstTime !== 'false';
    constructor() {
        console.log(this.ct1);
        const now = Date.now();
        if (now - this.lastSpin >= App.ONE_DAY) {
            localStorage.lastSpin = now;
        }

        this.handleUseCoin = this.handleUseCoin.bind(this);
        this.handleGetPrice = this.handleGetPrice.bind(this);

        let focusActive = false;

        document.getElementById('referralForm').addEventListener('submit', this.submitForm);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !focusActive) {
                focusActive = true;
                document.body.classList.add(App.C_FOCUS_ACTIVE);
            } else if (e.key === 'Escape' && focusActive) {
                focusActive = false;
                document.body.classList.remove(App.C_FOCUS_ACTIVE);
            }
        });
        const phoneInputField = document.querySelector('#number');
        const phoneInput = window.intlTelInput(phoneInputField, {
            initialCountry: 'in',
            preferredCountries: ['in', 'us', 'au', 'co'],
            utilsScript:
            'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js',
        });

        document.addEventListener('mousedown', () => {
            focusActive = false;
            document.body.classList.remove(App.C_FOCUS_ACTIVE);
        });
        const firebaseConfig = {
            apiKey: 'AIzaSyDfeNYGpnsrDHyAks9q-72HRY5OXP8tQPg',
            authDomain: 'game-referral.firebaseapp.com',
            databaseURL: 'https://game-referral-default-rtdb.firebaseio.com',
            projectId: 'game-referral',
            storageBucket: 'game-referral.appspot.com',
            messagingSenderId: process.env.SENDER_ID,
            appId: process.env.APP_ID,
            measurementId: process.env.MEASUREMENT_ID,
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        const username = process.env.USERNAME;
        const pwd = process.env.PASSWORD;
        const auth = firebase.auth().signInWithEmailAndPassword(username, pwd);
        const facebookBtn = document.getElementById('fb');
        const twitterBtn = document.getElementById('twitter');
        const linkedinBtn = document.getElementById('linkedin');
        const whatsappBtn = document.getElementById('wa');
        const postUrl = 'https://slotgame.vercel.app/';
        const postTitle = encodeURI('Play this game to win cash and exciting prizes like I did on the Blozum website. Blozum Website:');

        facebookBtn.setAttribute(
            'href',
            `https://www.facebook.com/sharer.php?u=${ postUrl }`,
        );

        twitterBtn.setAttribute(
            'href',
            `https://twitter.com/share?url=${ postUrl }&text=${ postTitle }`,
        );

        linkedinBtn.setAttribute(
            'href',
            `https://www.linkedin.com/shareArticle?url=${ postUrl }&title=${ postTitle }`,
        );

        whatsappBtn.setAttribute(
            'href',
            `https://wa.me/?text=${ postTitle } ${ postUrl }`,
        );
        // Init/render conditional parts of the UI such as vibration and first-time only features:
        this.initUI();
    }

    removeCommas(word) {
        console.log(this.ct1);
        return word.replace(/,/g, '');
    }

    process(event) {
        console.log(this.ct1);
        event.preventDefault();
    }

    refCodeGen() {
        const alphaNumeric = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const picks = [];

        // loop through alphabets array and pick an alphabet with the generated index
        for (let i = 0; i < 6; i++) {
            const key = Math.floor(Math.random() * alphaNumeric.length);
            picks.push(alphaNumeric[key]);
        }

        // convert selected alphabets array to string and remove seperating commas
        let letters1 = picks.toString();
        letters1 = this.removeCommas(letters1);
        return letters1;
    }

    CopyToClipboard(id) {
        console.log(this.ct1);
        navigator.clipboard.writeText(id);
    }

    submitForm(e) {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const emailid = document.getElementById('emailid').value;
        const number = document.getElementById('number').value;
        const referral = document.getElementById('referral').value;

        // check the user name with the referral code - "referral".

        const uniqueCode = firstName.substring(0, 3).toUpperCase() + referralCodeGenerator.alphaNumeric('uppercase', 8, 4).substring(0, 6);
        const query = firebase.database().ref('Game-Referral');
        query.once('value')
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    const key = childSnapshot.key;
                    const childData = childSnapshot.val();
                    if (referral === childData.uniqueCode) {
                        const updates = {};
                        updates[`Game-Referral/${ key }/count`] = firebase.database.ServerValue.increment(1);
                        updates[`Game-Referral/${ key }/firstName`] = childData.firstName;
                        updates[`Game-Referral/${ key }/referral`] = childData.uniqueCode;
                        updates[`Game-Referral/${ key }/emailid`] = childData.emailid;
                        updates[`Game-Referral/${ key }/value`] = childData.value;
                        query.update(updates);
                    }
                });
            });
        const contactFormDB = firebase.database().ref('Game-Referral');
        const newContactForm = contactFormDB.push();
        console.log(this.ct1);
        const coin2 = 1000 + parseInt(localStorage.value);
        document.getElementById('Ref1').innerHTML = 'Your Unique Referral Code: ' + uniqueCode;
        const facebookBtn = document.getElementById('fb');
        const twitterBtn = document.getElementById('twitter');
        const linkedinBtn = document.getElementById('linkedin');
        const whatsappBtn = document.getElementById('wa');
        const postUrl = 'https://slotgame.vercel.app/';
        const postTitle = encodeURI('Play this game and use my Blozum referral code to win cash, vouchers, and exciting prizes like I did on the Blozum website. My Referral code : ' + uniqueCode + ' Blozom Website:');
        document.getElementById('ref_copy').addEventListener('copy_ref', navigator.clipboard.writeText('Play this game and use my Blozum referral code to win cash, vouchers, and exciting prizes like I did on the Blozum website. My Referral code : ' + uniqueCode + ' Blozom Website: ' + postUrl));

        facebookBtn.setAttribute(
            'href',
            `https://www.facebook.com/sharer.php?u=${ postUrl }`,
        );

        twitterBtn.setAttribute(
            'href',
            `https://twitter.com/share?url=${ postUrl }&text=${ postTitle }`,
        );

        linkedinBtn.setAttribute(
            'href',
            `https://www.linkedin.com/shareArticle?url=${ postUrl }&title=${ postTitle }`,
        );

        whatsappBtn.setAttribute(
            'href',
            `https://wa.me/?text=${ postTitle } ${ postUrl }`,
        );


        newContactForm.set({
            firstName,
            emailid,
            uniqueCode,
            number,
            count: 0,
            value: coin2,
        });
        // ".validate": "newData.hasChildren(['firstName', 'emailid', 'uniqueCode', 'number', 'count', 'value'])",
        setTimeout(function () {
            document.getElementById('referralForm').reset();
            document.getElementById('close').click();
            document.getElementsByClassName('btn btn-lg btn-warning')[7].click();
        }, 500);
    }


    handleUseCoin() {
        if (this.coin_percentage >= 95) {
            localStorage.coins = this.coins -= 30;
            localStorage.coin_percentage = this.coin_percentage = Math.round(Math.min(this.coins / 3, 100));
        }
        localStorage.coins = this.coins = Math.max(this.coins - 1, 0) || 5;
        localStorage.coin_percentage = this.coin_percentage = Math.round(Math.min(this.coins / 3, 100));
        // this.handlebar();
        // localStorage.spins = ++this.spins;
        localStorage.lastSpin = this.lastSpin = Date.now();

        this.refreshGameInfo();
    }

    handleGetPrice(jackpotPercentage) {
        if (this.coin_percentage >= 95) {
            localStorage.coins = this.coins -= 30;
            localStorage.coin_percentage = this.coin_percentage = Math.round(Math.min(this.coins / 3, 100));
        }
        const price = jackpotPercentage;
        localStorage.coins = this.coins += price;
        console.log(this.ct1);
        localStorage.coin_percentage = this.coin_percentage = Math.round(Math.min(this.coins / 3, 100));
        this.refreshGameInfo();
    }

    refreshGameInfo() {
        if (this.coin_percentage >= 95) {
            localStorage.coins = this.coins -= 30;
            localStorage.coin_percentage = this.coin_percentage = Math.round(Math.min(this.coins / 3, 100));
        }
        const padding = 5;
        this.jackpotElement.innerText = `${ this.coin_percentage }`.padStart(padding, '0');

        clearTimeout(this.timeout);
        this.handlebar();
    }

    initToggleButtons() {
        // eslint-disable-next-line no-new
        new ToggleButton(App.S_TOGGLE_SOUND, 'sound', this.isSoundDisabled, handleOptionChange);

    }

    initUI() {
        const { isFirstTime } = this;
        // Init/render the game info at the top:
        this.refreshGameInfo();

        this.slotMachine = new SlotMachine(
            this.mainElement,
            this.handleUseCoin,
            this.handleGetPrice,
            5,
            SYMBOLS_RANDOM,
            isFirstTime,
        );

        this.initToggleButtons();
        // Init/render slot machine symbols:
        if (isFirstTime) {
            this.isFirstTime = localStorage.firstTime = false;

            document.activeElement.blur();

            this.handlebar();

            this.slotMachine.start();
            this.slotMachine.resume();
        }

    }

    handleNoti() {
        const now = Date.now();
        const button = document.getElementsByClassName('btn btn-lg btn-warning')[0];
        const card = document.getElementById('p1');
        if (now - this.time >= 5000) {
            this.percent = Math.random() * (5) + 83;
            if (this.ct < 50) {
                this.percent = Math.random() * (5.3) + 91.5;
            }
            if (this.ct > 50 && this.ct < 150) {
                this.percent = Math.random() * 5 + 88;
            }
        }
        if (this.ct <= 49) {
            localStorage.value = this.ct * 20;
            card.innerHTML = 'Wow! You did better than <b>' + this.percent.toFixed(2) + '%</b> people in the last game.<br>Your rewards: <b>' + this.ct * 20 + ' BLZ coins</b>.<br><br>Claim your rewards by joining the waitlist below!';
        } else {
            localStorage.value = 1000;
            card.innerHTML = 'Wow! You did better than <b>' + this.percent.toFixed(2) + '%</b> people in the last game.<br>Your rewards: <b>' + 1000 + ' BLZ coins</b>.<br><br>Claim your rewards by joining the waitlist below!';
        }
        this.time = Date.now();
        setTimeout(function () {
            button.click();
        }, 950);
    }

    handlebar() {
        this.ct++;
        const progressBar = document.getElementsByClassName('progress-bar bg-success')[0];
        progressBar.style.width = `${ Math.round(this.coin_percentage) }%`;
        if (this.coin_percentage >= 15) {
            this.handleNoti();
        }
    }

}

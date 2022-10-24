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
import { HAS_TOUCH } from '../../constants/browser.constants';
import { SlotMachine } from '../slot-machine/slot-machine.component';
import { ToggleButton } from '../toggle-button/toggle-button.component';
import { SMSoundService } from '../../services/slot-machine/sound/slot-machine-sound.service';
import { SMVibrationService } from '../../services/slot-machine/vibration/slot-machine-vibration.service';

import './app.style.scss';
import '../header/header.styles.scss';
import '../footer/footer.styles.scss';

const SERVICES = {
    sound: SMSoundService,
    vibration: SMVibrationService,
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

    coins = 5; ct = 1; percent = 80; time = null;
    coin_percentage = 0;
    lastSpin = localStorage.lastSpin || 0;
    isSoundDisabled = localStorage.sound === 'false';
    isVibrationDisabled = localStorage.vibration === 'false';
    isInstructionDisabled = 'false';
    isFirstTime = localStorage.firstTime !== 'false';

    constructor() {
        const now = Date.now();
        if (now - this.lastSpin >= App.ONE_DAY) {
            localStorage.lastSpin = now;
        }

        this.handleUseCoin = this.handleUseCoin.bind(this);
        this.handleGetPrice = this.handleGetPrice.bind(this);

        let focusActive = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !focusActive) {
                focusActive = true;
                document.body.classList.add(App.C_FOCUS_ACTIVE);
            } else if (e.key === 'Escape' && focusActive) {
                focusActive = false;
                document.body.classList.remove(App.C_FOCUS_ACTIVE);
            }
        });

        document.addEventListener('mousedown', () => {
            focusActive = false;
            document.body.classList.remove(App.C_FOCUS_ACTIVE);
        });
        // Init/render conditional parts of the UI such as vibration and first-time only features:
        this.initUI();
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
        // console.log(this.coins);
        localStorage.coin_percentage = this.coin_percentage = Math.round(Math.min(this.coins / 3, 100));
        // console.log(this.coin_percentage);
        // this.handlebar();
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

    initUI() {
        const { isFirstTime } = this;
        // Init/render the game info at the top:
        this.refreshGameInfo();

        if (!HAS_TOUCH) {
            document.querySelector(App.S_TOGGLE_VIBRATION).parentElement.setAttribute('hidden', true);
        }

        this.initToggleButtons();

        if (isFirstTime) {
            this.isFirstTime = localStorage.firstTime = false;

            document.activeElement.blur();

            this.handlebar();

            this.slotMachine.start();
        }

        // Init/render slot machine symbols:
        this.slotMachine = new SlotMachine(
            this.mainElement,
            this.handleUseCoin,
            this.handleGetPrice,
            5,
            SYMBOLS_RANDOM,
            isFirstTime,
        );
    }

    initToggleButtons() {
        // eslint-disable-next-line no-new
        new ToggleButton(App.S_TOGGLE_SOUND, 'sound', !this.isSoundDisabled, handleOptionChange);

        if (HAS_TOUCH) {
            // eslint-disable-next-line no-new
            new ToggleButton(App.S_TOGGLE_VIBRATION, 'vibration', !this.isVibrationDisabled, handleOptionChange);
        }
    }

    handleNoti() {
        const now = Date.now();
        const button = document.getElementsByClassName('btn btn-lg btn-warning')[0];
        const card = document.getElementById('p1');
        console.log(this.ct);
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
            card.innerHTML = 'Wow! You did better than <b>' + this.percent.toFixed(2) + '%</b> people in the last game.<br>Your rewards: <b>' + this.ct * 20 + ' BZM coins</b>.<br><br>Claim your rewards by joining the waitlist below!';
        } else {
            card.innerHTML = 'Wow! You did better than <b>' + this.percent.toFixed(2) + '%</b> people in the last game.<br>Your rewards: <b>' + 1000 + ' BZM coins</b>.<br><br>Claim your rewards by joining the waitlist below!';
        }
        this.time = Date.now();
        console.log(this.ct * 20);
        setTimeout(function () {
            button.click();
        }, 950);
    }

    handlebar() {
        this.ct++;
        if (this.ct === 2) {
            const button2 = document.getElementsByClassName('btn btn-lg btn-warning')[1];
            button2.click();
        }
        const progressBar = document.getElementsByClassName('progress-bar bg-success')[0];
        progressBar.style.width = `${ Math.round(this.coin_percentage) }%`;
        if (this.coin_percentage >= 15) {
            this.handleNoti();
        }
    }

}

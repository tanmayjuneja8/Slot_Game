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
import { Modal } from '../modal/modal.component';
import { PayTable } from '../pay-table/pay-table.component';
import { SMSoundService } from '../../services/slot-machine/sound/slot-machine-sound.service';
import { SMVibrationService } from '../../services/slot-machine/vibration/slot-machine-vibration.service';


import './app.style.scss';
import '../header/header.styles.scss';
import '../footer/footer.styles.scss';
import '../modal/modal.styles.scss';
import '../pay-table/pay-table.styles.scss';
import '../instructions/instructions.styles.scss';

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
    static S_JACKPOT = '#jackpot';
    static S_SPINS = '#spins';
    static S_MAIN = '#main';
    static S_TOGGLE_SOUND = '#toggleSound';
    static S_TOGGLE_VIBRATION = '#toggleVibration';
    static S_VIBRATION_INSTRUCTIONS = '#vibrationInstructions';
    static S_INSTRUCTIONS_MODAL = '#instructionsModal';
    static S_INSTRUCTIONS_MODAL_BUTTON = '#toggleInstructions';
    static S_PAY_TABLE_MODAL = '#payTableModal';
    static S_PAY_TABLE_MODAL_BUTTON = '#togglePayTable';
    static S_PLAY = '#playButton';

    // Misc.:
    static ONE_DAY = 1000 * 60 * 60 * 24;
    // Elements:
    coinsElement = document.querySelector(App.S_COINS);
    jackpotElement = document.querySelector(App.S_JACKPOT);
    spinsElement = document.querySelector(App.S_SPINS);
    mainElement = document.querySelector(App.S_MAIN);

    // Components:
    slotMachine;
    payTable;
    instructionsModal;

    // State:
    // TODO: Create constants in a config file for all these numbers...
    coins = 5; // parseInt(localStorage.coins, 10) || 100;
    jackpot = parseInt(localStorage.jackpot, 10) || 1000;
    spins = parseInt(localStorage.spins, 10) || 0;
    lastSpin = localStorage.lastSpin || 0;
    isSoundDisabled = localStorage.sound === 'false';
    isVibrationDisabled = localStorage.vibration === 'false';
    isFirstTime = localStorage.firstTime !== 'false';

    constructor() {
        const now = Date.now();
        // Update jackpot randomly:
        if (now - this.lastSpin >= App.ONE_DAY) {
            localStorage.jackpot = this.jackpot = Math.max(500, this.jackpot - 500 + (Math.random() * 1000)) | 0;
            localStorage.lastSpin = now;
        }

        // Bind event listeners:
        this.handleModalToggle = this.handleModalToggle.bind(this);
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
        localStorage.coins = this.coins = Math.max(this.coins - 1, 0) || 5;
        localStorage.jackpot = ++this.jackpot;
        localStorage.spins = ++this.spins;
        localStorage.lastSpin = this.lastSpin = Date.now();

        this.refreshGameInfo();
    }

    handleGetPrice(jackpotPercentage) {
        const price = jackpotPercentage;
        localStorage.jackpot = this.jackpot = 1000;
        // console.log(localStorage.jackpot);
        localStorage.coins = this.coins += price;
        this.refreshGameInfo();
    }

    refreshGameInfo() {
        const maxValue = Math.max(this.coins, this.spins);
        const padding = Math.max(Math.ceil(maxValue.toString().length / 2) * 2, 5);
        // if (localStorage.coins >= 100) {
        //     console.log('Wowza paaji!');
        // }
        this.coinsElement.innerText = `${ this.coins }`.padStart(padding, '0');
        this.jackpotElement.innerText = `${ this.jackpot }`.padStart(padding, '0');
        this.spinsElement.innerText = `${ this.spins }`.padStart(padding, '0');
    }

    initUI() {
        const { isFirstTime } = this;

        // Init/render the game info at the top:
        this.refreshGameInfo();

        if (!HAS_TOUCH) {
            // TODO: Move to toggle button?
            document.querySelector(App.S_TOGGLE_VIBRATION).parentElement.setAttribute('hidden', true);
            // TODO: Move to instructions modal?
            document.querySelector(App.S_VIBRATION_INSTRUCTIONS).setAttribute('hidden', true);
        }

        this.initToggleButtons();

        const playButtonElement = document.querySelector(App.S_PLAY);

        if (isFirstTime) {

            playButtonElement.onclick = () => {
                this.isFirstTime = localStorage.firstTime = false;

                playButtonElement.setAttribute('hidden', true);

                this.instructionsModal.close();

                document.activeElement.blur();

                this.slotMachine.start();
            };
        } else {
            playButtonElement.setAttribute('hidden', true);
        }

        // TODO: Pass params as options, except for root selector or some of the basic ones...:

        // Init/render instructions modal, which might be open straight away:
        this.instructionsModal = new Modal(
            App.S_INSTRUCTIONS_MODAL,
            App.S_INSTRUCTIONS_MODAL_BUTTON,
            'instructions',
            isFirstTime,
            isFirstTime,
            this.handleModalToggle,
        );

        // Init/render slot machine symbols:
        this.slotMachine = new SlotMachine(
            this.mainElement,
            this.handleUseCoin,
            this.handleGetPrice,
            5,
            SYMBOLS_RANDOM,
            isFirstTime,
        );

        // Init/render pay table and pay table modal, which is always closed in the beginning:
        this.payTable = new PayTable(SYMBOLS_RANDOM);

        // TODO: Should be disabled in the begining (or hide button):
        // TODO: Hide modals with hidden rather than is-open...
        // eslint-disable-next-line no-new
        new Modal(
            App.S_PAY_TABLE_MODAL,
            App.S_PAY_TABLE_MODAL_BUTTON,
            'pay-table',
            false,
            false,
            this.handleModalToggle,
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

    handleModalToggle(isOpen, key) {
        if (!this.slotMachine || key.includes('-init')) return;

        if (isOpen) {
            this.slotMachine.pause();
        } else {
            this.slotMachine.resume();
        }
    }

}

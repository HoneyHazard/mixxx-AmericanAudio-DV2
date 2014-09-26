function AmericanAudioDV2() {}

AmericanAudioDV2.init = function (id) {
    midi.sendShortMsg(0x91, 0x0F, 0x5);
}

